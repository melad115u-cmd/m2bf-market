import React, { useState } from 'react';
import { Product, Category } from '../types';
import { Edit3, X, Save, Image, DollarSign, CalendarCheck, Package, Layers } from 'lucide-react';

interface Props {
  product: Product;
  categories: Category[];
  onSave: (id: string, updatedFields: Partial<Product>) => void;
  onClose: () => void;
}

export const EditProductModal: React.FC<Props> = ({
  product,
  categories,
  onSave,
  onClose
}) => {
  const [name, setName] = useState(product.name);
  const [categoryId, setCategoryId] = useState(product.category);
  const [price, setPrice] = useState<number>(product.price);
  const [originalPrice, setOriginalPrice] = useState<number>(product.originalPrice || product.price);
  const [costPrice, setCostPrice] = useState<number>(product.costPrice || 0);
  const [stock, setStock] = useState<number>(product.stock);
  const [brand, setBrand] = useState(product.brand || '');
  const [description, setDescription] = useState(product.description || '');
  const [image, setImage] = useState(product.image || '');
  const [isInstallmentAvailable, setIsInstallmentAvailable] = useState(product.isInstallmentAvailable ?? true);
  const [installmentInterestRate, setInstallmentInterestRate] = useState<number>(product.installmentInterestRate ?? 15);
  const [inquiryFee, setInquiryFee] = useState<number>(product.inquiryFee ?? 150);
  const [maxInstallmentMonths, setMaxInstallmentMonths] = useState<number>(product.maxInstallmentMonths ?? 12);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(product.id, {
      name,
      category: categoryId,
      price: Number(price),
      originalPrice: Number(originalPrice),
      costPrice: Number(costPrice),
      stock: Number(stock),
      brand,
      description,
      image,
      isInstallmentAvailable,
      installmentInterestRate: Number(installmentInterestRate),
      inquiryFee: Number(inquiryFee),
      maxInstallmentMonths: Number(maxInstallmentMonths)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl text-right">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-amber-400" />
            <h3 className="font-black text-base text-white">تعديل بيانات المنتج والمخزون والتقسيط</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Product Name */}
            <div className="md:col-span-2">
              <label className="block text-gray-300 font-bold mb-1">اسم المنتج المعروض بالمتجر *</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-gray-300 font-bold mb-1">القسم التابع له *</label>
              <select
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold outline-none focus:ring-2 focus:ring-amber-400"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Brand */}
            <div>
              <label className="block text-gray-300 font-bold mb-1">الماركة أو البراند</label>
              <input
                type="text"
                value={brand}
                onChange={e => setBrand(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            {/* Pricing */}
            <div>
              <label className="block text-gray-300 font-bold mb-1">سعر البيع النهائي (ج.م) *</label>
              <input
                type="number"
                required
                min="1"
                value={price}
                onChange={e => setPrice(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-amber-400 font-black font-mono outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-1">السعر قبل الخصم (ج.م)</label>
              <input
                type="number"
                min="0"
                value={originalPrice}
                onChange={e => setOriginalPrice(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-gray-300 font-mono outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-1">سعر التكلفة التقديري (ج.م)</label>
              <input
                type="number"
                min="0"
                value={costPrice}
                onChange={e => setCostPrice(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-gray-300 font-mono outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            {/* Stock */}
            <div>
              <label className="block text-gray-300 font-bold mb-1">رصيد المخزون المتوفر بالمستودعات *</label>
              <input
                type="number"
                required
                min="0"
                value={stock}
                onChange={e => setStock(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-emerald-400 font-black font-mono outline-none focus:ring-2 focus:ring-amber-400"
              />
              <span className="text-[10px] text-gray-400 block mt-0.5">
                طلبيات العملاء مقيدة ومحصورة بهذا الرصيد ولن يسمح بتجاوزه أبداً.
              </span>
            </div>

            {/* Product Image */}
            <div className="md:col-span-2">
              <label className="block text-gray-300 font-bold mb-1 flex items-center gap-1.5">
                <Image className="w-4 h-4 text-sky-400" />
                <span>رابط صورة المنتج (URL)</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={image}
                  onChange={e => setImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs outline-none focus:ring-2 focus:ring-amber-400"
                />
                {image && (
                  <img src={image} alt="preview" className="w-10 h-10 object-cover rounded-lg border border-slate-700 shrink-0" />
                )}
              </div>
            </div>

            {/* Installment System Controls */}
            <div className="md:col-span-2 bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4 text-emerald-400" />
                  <span className="font-black text-white text-xs">نظام التقسيط الخاص بهذا المنتج:</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isInstallmentAvailable}
                    onChange={e => setIsInstallmentAvailable(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  <span className="mr-2 text-xs font-bold text-gray-300">
                    {isInstallmentAvailable ? 'متاح للتقسيط' : 'نقدي فقط (ملغي التقسيط)'}
                  </span>
                </label>
              </div>

              {isInstallmentAvailable && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800">
                  <div>
                    <label className="block text-gray-300 font-bold mb-1">نسبة الفائدة الإجمالية (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={installmentInterestRate}
                      onChange={e => setInstallmentInterestRate(Number(e.target.value))}
                      className="w-full p-2 rounded-xl bg-slate-800 border border-slate-700 text-amber-400 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 font-bold mb-1">مصاريف الاستعلام والتحري (ج.م)</label>
                    <input
                      type="number"
                      min="0"
                      value={inquiryFee}
                      onChange={e => setInquiryFee(Number(e.target.value))}
                      className="w-full p-2 rounded-xl bg-slate-800 border border-slate-700 text-amber-400 font-mono font-bold"
                    />
                    <span className="text-[10px] text-gray-400 block mt-0.5">تحصل فوراً عند الطلب</span>
                  </div>

                  <div>
                    <label className="block text-gray-300 font-bold mb-1">الحد الأقصى للشهور</label>
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={maxInstallmentMonths}
                      onChange={e => setMaxInstallmentMonths(Number(e.target.value))}
                      className="w-full p-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono font-bold"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-gray-300 font-bold mb-1">وصف المنتج ومواصفاته</label>
              <textarea
                rows={2}
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-gray-300 font-bold hover:bg-slate-700 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>حفظ التعديلات</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
