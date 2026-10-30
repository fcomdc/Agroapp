const ts = require("typescript");
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { DatabaseSync } = require("node:sqlite");

function loadApp(native = false, store = new Map()) {
  const cache = new Map();
  let failWrite = false;
  let failOutbox = false;
  const storage = {
    getAllKeys: async () => [...store.keys()],
    getItem: async (key) => store.get(key) ?? null,
    setItem: async (key, value) => {
      if (failWrite) throw new Error("disk full");
      store.set(key, value);
    },
  };
  const sqlite = new DatabaseSync(":memory:");
  const db = {
    execAsync: async (sql) => sqlite.exec(sql),
    withExclusiveTransactionAsync: async (task) => {
      sqlite.exec("BEGIN IMMEDIATE");
      try {
        await task(db);
        sqlite.exec("COMMIT");
      } catch (error) {
        sqlite.exec("ROLLBACK");
        throw error;
      }
    },
    getAllAsync: async (sql, args = []) => sqlite.prepare(sql).all(...args),
    getFirstAsync: async (sql, args = []) =>
      sqlite.prepare(sql).get(...args) ?? null,
    runAsync: async (sql, args = []) => {
      if (failOutbox && sql.includes("INSERT INTO OperacionesPendientes"))
        throw new Error("outbox failure");
      const result = sqlite.prepare(sql).run(...args);
      return {
        changes: Number(result.changes),
        lastInsertRowId: Number(result.lastInsertRowid),
      };
    },
  };
  function load(file) {
    const absolute = path.resolve(__dirname, "..", file);
    if (cache.has(absolute)) return cache.get(absolute);
    const source = ts.transpileModule(fs.readFileSync(absolute, "utf8"), {
      fileName: absolute,
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        esModuleInterop: true,
      },
    }).outputText;
    const exports = {};
    cache.set(absolute, exports);
    const requireModule = (ref) => {
      if (ref === "expo-crypto")
        return { randomUUID: require("node:crypto").randomUUID };
      if (ref === "./NativeSQLite")
        return {
          getNativeSQLite: () =>
            native ? { openDatabaseAsync: async () => db } : null,
        };
      if (ref === "expo")
        return { requireOptionalNativeModule: () => (native ? {} : null) };
      if (ref === "expo-sqlite") return { openDatabaseAsync: async () => db };
      if (ref.includes("async-storage")) return storage;
      return load(
        path.relative(
          path.resolve(__dirname, ".."),
          path.resolve(path.dirname(absolute), ref + ".ts")
        )
      );
    };
    vm.runInNewContext(
      source,
      { exports, require: requireModule, console, Date, Set, Map, Promise },
      { filename: absolute }
    );
    return exports;
  }
  return {
    load,
    store,
    failWrites: () => {
      failWrite = true;
    },
    failOutbox: () => {
      failOutbox = true;
    },
    close: () => sqlite.close(),
  };
}

for (const native of [false, true])
  test(
    native
      ? "SQLite CRUD and queries"
      : "Fallback CRUD, queries and persistence",
    async () => {
      const app = loadApp(native);
      try {
        const database = app.load("src/database/Database.ts");
        const [first, second] = await Promise.all([
          database.getDatabase(),
          database.initDatabase(),
        ]);
        assert.equal(first, second);
        const users = app.load("src/database/repositories/UsuariosDB.ts");
        assert.equal((await users.login("admin", "admin123")).Usuario, "admin");
        assert.equal(await users.login("admin", "bad"), null);
        const id = await users.create({
          NombreCompleto: "Worker",
          Usuario: "worker",
          Contrasena: "1234",
          Rol: "Trabajador",
        });
        assert.equal((await users.getByRol("Trabajador")).length, 1);
        assert.equal(
          (await users.getAll()).some((row) => "Contrasena" in row),
          false
        );
        await users.remove(id);
        assert.equal(await users.login("worker", "1234"), null);
        assert.equal((await users.getByRol("Trabajador")).length, 0);
        await assert.rejects(
          users.create({
            NombreCompleto: "Worker",
            Usuario: "worker",
            Contrasena: "1234",
            Rol: "Trabajador",
          })
        );
        const cows = app.load("src/database/repositories/BovinosDB.ts");
        const cow = await cows.create({
          Codigo: "TEST",
          Sexo: "H",
          Nombre: "Test",
        });
        await cows.update(cow, { Nombre: "Updated" });
        assert.equal((await cows.getById(cow)).Nombre, "Updated");
        const pending = app.load(
          "src/database/repositories/syncRepository.ts"
        ).syncRepository;
        const queued = await pending.getPending();
        assert.ok(
          queued.some((o) => o.Entidad === "Bovinos" && o.IdLocal === cow)
        );
        const operationId = queued.find(
          (o) => o.Entidad === "Bovinos"
        ).IdOperacion;
        assert.equal(
          (await pending.getPending()).some(
            (o) => o.IdOperacion === operationId
          ),
          true
        );
        await pending.acknowledge(operationId);
        assert.equal(
          (await pending.getPending()).some(
            (o) => o.IdOperacion === operationId
          ),
          false
        );
        const weights = app.load("src/database/repositories/PesosDB.ts");
        const weight = await weights.create({
          IdBovino: cow,
          Peso: 400,
          FechaPeso: "2026-01-01",
          Perimetros: "[170,171,172]",
          Longitudes: "[140,141,142]",
          Metodo: "schaeffer-cm-kg-v1",
        });
        assert.equal(
          (await weights.getByBovino(cow))[0].Metodo,
          "schaeffer-cm-kg-v1"
        );
        assert.equal(
          (await weights.getByBovino(cow))[0].Perimetros,
          "[170,171,172]"
        );
        await weights.create({
          IdBovino: cow,
          Peso: 450,
          FechaPeso: "2026-02-01",
        });
        assert.equal((await weights.getLatestByBovino(cow)).Peso, 450);
        await weights.remove(weight);
        assert.equal((await weights.getByBovino(cow)).length, 1);
        const nfc = app.load("src/database/repositories/NfcDB.ts");
        const tag = await nfc.create({ IdBovino: cow, UID_NFC: "TAG" });
        assert.equal((await nfc.getByUID("TAG")).IdBovino, cow);
        await nfc.remove(tag);
        assert.equal(await nfc.getByUID("TAG"), null);
        const health = app.load("src/database/repositories/ReportesSaludDB.ts");
        const report = await health.create({
          IdBovino: cow,
          IdUsuario: 1,
          Sintomas: "Test",
          Gravedad: "Alta",
        });
        await health.atender(report, "Diagnosis", "Treatment");
        const attended = (await health.getByEstado("Atendido"))[0];
        assert.equal(attended.Diagnostico, "Diagnosis");
        assert.ok(attended.FechaAtencion);
        assert.equal((await health.getPendientes()).length, 0);
        const vaccines = app.load(
          "src/database/repositories/VacunacionesDB.ts"
        );
        await vaccines.create({
          IdBovino: cow,
          FechaAplicacion: "2026-01-01",
          ProximaAplicacion: "2000-01-01",
        });
        await vaccines.create({
          IdBovino: cow,
          FechaAplicacion: "2026-01-01",
          ProximaAplicacion: "2099-01-01",
        });
        assert.equal((await vaccines.getProximas()).length, 1);
        const births = app.load("src/database/repositories/PartosDB.ts");
        const birth = await births.create({
          IdMadre: cow,
          FechaParto: "2026-01-01",
          TipoParto: "Normal",
          CantidadCrías: 2,
        });
        assert.equal((await births.getAll())[0].CantidadCrías, 2);
        const calves = app.load("src/database/repositories/CriasPartoDB.ts");
        await calves.create({ IdParto: birth, Sexo: "H" });
        await calves.create({ IdParto: birth, Sexo: "M" });
        assert.equal((await calves.getAll())[0].CodigoMadre, "TEST");
        await births.remove(birth);
        assert.equal((await calves.getByParto(birth)).length, 0);
        if (!native) {
          const reload = loadApp(false, app.store);
          assert.equal(
            (
              await reload
                .load("src/database/repositories/BovinosDB.ts")
                .getById(cow)
            ).Nombre,
            "Updated"
          );
          reload.close();
          app.failWrites();
          await assert.rejects(cows.update(cow, { Nombre: "Lost" }));
          assert.equal((await cows.getById(cow)).Nombre, "Updated");
        }
      } finally {
        app.close();
      }
    }
  );

test("Local calendar dates do not shift and impossible dates are rejected", () => {
  const app = loadApp();
  try {
    const helpers = app.load("src/utils/helpers.ts");
    assert.equal(helpers.formatDate("2026-10-23"), "23/10/2026");
    assert.equal(helpers.isValidDate("2026-02-30"), false);
    assert.equal(helpers.isValidDate("2024-02-29"), true);
  } finally {
    app.close();
  }
});

test("Native transaction rolls back a domain record when its outbox write fails", async () => {
  const app = loadApp(true);
  try {
    await app.load("src/database/Database.ts").initDatabase();
    const cows = app.load("src/database/repositories/BovinosDB.ts");
    app.failOutbox();
    await assert.rejects(cows.create({ Codigo: "ROLLBACK", Sexo: "H" }));
    assert.equal(await cows.getByCode("ROLLBACK"), null);
  } finally {
    app.close();
  }
});

test("Additive migrations preserve weights and can run twice", async () => {
  const app = loadApp(true);
  try {
    const db = await app.load("src/database/Database.ts").initDatabase();
    const cows = app.load("src/database/repositories/BovinosDB.ts");
    const id = await cows.create({ Codigo: "MIGRATION", Sexo: "H" });
    const weights = app.load("src/database/repositories/PesosDB.ts");
    await weights.create({ IdBovino: id, Peso: 420, FechaPeso: "2026-10-27" });
    const migrate = app.load("src/database/migrations.ts").migrateDatabase;
    await migrate(db);
    await migrate(db);
    assert.equal((await weights.getByBovino(id))[0].Peso, 420);
  } finally {
    app.close();
  }
});

test("Measurement medians, exact unit conversion and daily variation", () => {
  const app = loadApp();
  try {
    const m = app.load("src/utils/measurements.ts");
    assert.equal(m.medianOfThree([172, 170, 171]), 171);
    assert.throws(() => m.medianOfThree([0, 170, 171]));
    assert.throws(() => m.medianOfThree([170, 171]));
    const result = m.estimateWeight([172, 170, 171], [142, 140, 141]);
    assert.equal(
      result.kg,
      Math.round(((0.45359237 * 141 * 171 ** 2) / (300 * 2.54 ** 3)) * 100) /
        100
    );
    assert.equal(
      m.dailyWeightChange(
        { Peso: 440, FechaPeso: "2026-10-27" },
        { Peso: 420, FechaPeso: "2026-10-17" }
      ).kgPerDay,
      2
    );
    assert.equal(
      m.dailyWeightChange(
        { Peso: 440, FechaPeso: "2026-10-27" },
        { Peso: 420, FechaPeso: "2026-10-27" }
      ),
      null
    );
    const p = app.load("src/utils/permissions.ts");
    assert.equal(p.can("Trabajador", "manageHerd"), false);
    assert.equal(p.can("Administrador", "diagnose"), false);
    assert.equal(p.can("Veterinario", "diagnose"), true);
  } finally {
    app.close();
  }
});
