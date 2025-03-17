export default function ProductsList({ products }) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 mt-6">
      {products.length > 0 ? (
        products.map((product) => (
          <a key={product.id} href={`/product/${product.id}`} className="group">
            <img
              alt={product.name}
              src={product.images?.[0]?.src || "/placeholder.jpg"}
              className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-7/8"
            />
            <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
            <p className="mt-1 text-lg font-medium text-gray-900">
              {product.price} {product.currency || "лв."}
            </p>
          </a>
        ))
      ) : (
        <p className="text-center text-gray-500">Няма налични продукти.</p>
      )}
    </div>
  );
}
