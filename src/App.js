import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("student");
  const [password, setPassword] = useState("");

  const url = "http://localhost:8000/api/v1/users";

  useEffect(() => {
    axios.get(url)
      .then((res) => setUsuarios(res.data))
      .catch((err) => console.error("❌ Error al obtener usuarios:", err));
  }, []);

  const agregarUsuario = () => {
    if (!email || !password) {
      alert("Por favor ingresa un email y contraseña");
      return;
    }

    axios.post(url, { email, role, password })
      .then((res) => {
        setUsuarios([...usuarios, res.data]);
        setEmail("");
        setPassword("");
        setRole("student");
      })
      .catch((err) => {
        console.error("❌ Error al crear usuario:", err);
        alert("No se pudo crear el usuario");
      });
  };

  const eliminarUsuario = (id) => {
    axios.delete(`${url}/${id}`)
      .then(() => {
        setUsuarios(usuarios.filter((u) => u.userId !== id));
      })
      .catch((err) => console.error("❌ Error al eliminar usuario:", err));
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">CRUD de Usuarios</h1>

      <div className="flex flex-col gap-2 mb-4">
        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <select
          className="border p-2 rounded"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
        </select>

        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="bg-pink-700 text-white p-2 rounded"
          onClick={agregarUsuario}
        >
          Agregar Usuario
        </button>
      </div>

      <ul className="space-y-2">
        {usuarios.map((u) => (
          <li
            key={u.userId}
            className="border p-2 rounded flex justify-between items-center"
          >
            <div>
              <strong>{u.email}</strong>{" "}
              <span className="text-gray-500">({u.role})</span>
            </div>
            <button
              className="bg-red-500 text-white px-2 py-1 rounded"
              onClick={() => eliminarUsuario(u.userId)}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;