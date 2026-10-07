import { useState } from "react";
import { useStore } from "../context/StoreContext";
import { totals, money } from "../utils/accounting";
import { productsReport } from "../utils/reports";
import Icon from "../components/Icon";
import ProductTable from "../components/ProductTable";
import Modal from "../components/Modal";
import UsageForm from "../components/UsageForm";
import UsageHistory from "../components/UsageHistory";
import PdfButton from "../components/PdfButton";
import "./Products.css";

export default function Products({ openForm, confirmDelete }) {
  const { data } = useStore();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [supplier, setSupplier] = useState("");
  const [using, setUsing] = useState(false);

  const items = data.products
    .filter(
      (product) =>
        `${product.name} ${product.code}`
          .toLowerCase()
          .includes(query.toLowerCase()) &&
        (!category || product.categoryId === category) &&
        (!supplier || product.supplierId === supplier)
    )
    .slice()
    .reverse();

  const sums = totals(items, data.payments);

  return (
    <>
      {using && (
        <Modal title="Mahsulot ishlatildi" onClose={() => setUsing(false)}>
          <UsageForm onClose={() => setUsing(false)} />
        </Modal>
      )}

      <div className="page-heading">
        <div>
          <p className="eyebrow">KIRIM VA QOLDIQLAR</p>
          <h1>Mahsulotlar</h1>
          <p>{data.products.length} ta mahsulot kirimi.</p>
        </div>

        <div className="supplier-heading-actions">
          <button className="button" onClick={() => openForm("product")}>
            <Icon name="plus" />
            Mahsulot qo‘shish
          </button>

          <button className="button secondary" onClick={() => setUsing(true)}>
            Ishlatildi
          </button>

          <PdfButton report={productsReport(data, items)} />
        </div>
      </div>

      <div className="toolbar product-filters">
        <label className="search-box">
          <Icon name="search" />
          <input
            aria-label="Mahsulot qidirish"
            placeholder="Mahsulot nomi yoki ID"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>

        <select
          aria-label="Kategoriya filtri"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          <option value="">Barcha kategoriyalar</option>
          {data.categories.map((item) => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </select>

        <select
          aria-label="Ta’minotchi filtri"
          value={supplier}
          onChange={(event) => setSupplier(event.target.value)}
        >
          <option value="">Barcha ta’minotchilar</option>
          {data.suppliers.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}{item.deletedAt ? " (arxiv)" : ""}
            </option>
          ))}
        </select>
      </div>

      <ProductTable
        products={items}
        onEdit={(product) => openForm("product", product)}
        onDelete={(id) => confirmDelete("products", id)}
        onPay={(product) =>
          openForm("payment", {
            supplierId: product.supplierId,
            productId: product.id,
          })
        }
      />

      <div className="table-footer">
        <span>{items.length} ta kirim</span>
        <span>Jami <strong>{money(sums.total)}</strong></span>
        <span>To‘langan <strong>{money(sums.paid)}</strong></span>
        <span>Qarz <strong>{money(sums.debt)}</strong></span>
      </div>

      <UsageHistory products={items} />
    </>
  );
}