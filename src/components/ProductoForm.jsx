import { useState } from "react";
import { createProducto } from "../services/api";

export default function ProductoForm({ onProductoAdded }) {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createProducto({ nombre, precio });
    onProductoAdded();
    setNombre("");
    setPrecio("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} className="border p-2 rounded w-full" />
      <input type="number" placeholder="Precio" value={precio} onChange={(e) => setPrecio(e.target.value)} className="border p-2 rounded w-full" />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Agregar Producto</button>
    </form>
  );
}
// import { useState } from "react";
// import { createProducto } from "../services/api";
//
// export default function ProductoForm({ onProductoAdded }) {
//   const [nombre, setNombre] = useState("");
//   const [precio, setPrecio] = useState("");
//