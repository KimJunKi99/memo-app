'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Search, Eraser, ShoppingBag } from 'lucide-react';

interface DaisoItem {
  id: string;
  name: string;
  price: number;
  category: string;
  note?: string;
  addedAt: number;
}

const CATEGORIES = [
  '주방용품', '문구/팬시', '수납/정리', '청소/세탁', 
  '욕실/위생', '미용/뷰티', '인테리어', '취미/공구', 
  '전자제품', '식품', '기타'
];

export default function DaisoApp() {
  const [items, setItems] = useState<DaisoItem[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [note, setNote] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('전체');

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('daiso-items');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse items', e);
      }
    }
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('daiso-items', JSON.stringify(items));
  }, [items]);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) return;

    const newItem: DaisoItem = {
      id: Date.now().toString(),
      name: name.trim(),
      price: Number(price),
      category,
      note: note.trim(),
      addedAt: Date.now(),
    };

    setItems([newItem, ...items]);
    setName('');
    setPrice('');
    setCategory(CATEGORIES[0]);
    setNote('');
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleClearAll = () => {
    if (confirm('정말로 모든 항목을 삭제하시겠습니까?')) {
      setItems([]);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.note?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === '전체' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const totalAmount = items.reduce((sum, item) => sum + item.price, 0);
  const filteredAmount = filteredItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="max-w-md mx-auto p-4 bg-gray-50 min-h-screen font-sans text-gray-900">
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-red-600 flex items-center justify-center gap-2">
          <ShoppingBag className="w-6 h-6" />
          다이소 장바구니
        </h1>
        <p className="text-sm text-gray-500 mt-1">잊지 말고 꼭 사자!</p>
      </header>

      {/* Input Form */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6 border border-gray-100">
        <form onSubmit={handleAddItem} className="space-y-3">
          <div>
            <input
              type="text"
              placeholder="상품명 (예: 건전지 AA)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
              required
            />
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="가격 (원)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-1/2 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
              required
              min="0"
              step="100"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-1/2 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm bg-white"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <input
              type="text"
              placeholder="메모 (선택사항)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2.5 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-1 active:scale-95 transform duration-100"
          >
            <Plus className="w-4 h-4" />
            추가하기
          </button>
        </form>
      </div>

      {/* Summary */}
      <div className="flex justify-between items-center mb-4 px-1">
        <div className="text-sm font-medium text-gray-600">
          총 {items.length}개 항목
        </div>
        <div className="text-lg font-bold text-gray-900">
          합계: {totalAmount.toLocaleString()}원
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="검색어 입력..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 p-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
          <button
            onClick={() => setFilterCategory('전체')}
            className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors ${
              filterCategory === '전체' 
                ? 'bg-gray-800 text-white' 
                : 'bg-white border border-gray-200 text-gray-600'
            }`}
          >
            전체
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors ${
                filterCategory === cat
                  ? 'bg-red-100 text-red-700 border border-red-200'
                  : 'bg-white border border-gray-200 text-gray-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-3 pb-20">
        {filteredItems.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">
            {items.length === 0 ? '장바구니가 비어있습니다.' : '검색 결과가 없습니다.'}
          </div>
        ) : (
          filteredItems.map(item => (
            <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-start group">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                    {item.category}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(item.addedAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="font-medium text-gray-900">{item.name}</h3>
                {item.note && <p className="text-xs text-gray-500 mt-1">{item.note}</p>}
                <div className="mt-1 font-bold text-gray-900">
                  {item.price.toLocaleString()}원
                </div>
              </div>
              <button
                onClick={() => handleDeleteItem(item.id)}
                className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors"
                aria-label="삭제"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Bottom Actions */}
      {items.length > 0 && (
        <div className="fixed bottom-6 right-6">
          <button
            onClick={handleClearAll}
            className="bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-900 transition-colors flex items-center justify-center"
            title="전체 삭제"
          >
            <Eraser className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
