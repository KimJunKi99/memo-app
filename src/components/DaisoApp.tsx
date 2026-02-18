'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Search, Eraser, ShoppingBag, User } from 'lucide-react';

interface DaisoItem {
  id: string;
  name: string;
  person: string;
  note?: string;
  addedAt: number;
}

const PERSONS = ['준기', '재영'];

export default function DaisoApp() {
  const [items, setItems] = useState<DaisoItem[]>([]);
  const [name, setName] = useState('');
  const [person, setPerson] = useState(PERSONS[0]);
  const [note, setNote] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPerson, setFilterPerson] = useState('전체');

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
    if (!name.trim()) return;

    const newItem: DaisoItem = {
      id: Date.now().toString(),
      name: name.trim(),
      person,
      note: note.trim(),
      addedAt: Date.now(),
    };

    setItems([newItem, ...items]);
    setName('');
    setPerson(PERSONS[0]);
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
    const matchesPerson = filterPerson === '전체' || item.person === filterPerson;
    return matchesSearch && matchesPerson;
  });

  return (
    <div className="max-w-md mx-auto p-4 bg-gray-50 min-h-screen font-sans text-gray-900">
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-red-600 flex items-center justify-center gap-2">
          <ShoppingBag className="w-6 h-6" />
          다이소 장바구니
        </h1>
        <p className="text-sm text-gray-500 mt-1">준기 & 재영의 쇼핑 리스트</p>
      </header>

      {/* Input Form */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6 border border-gray-100">
        <form onSubmit={handleAddItem} className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="상품명 (예: 건전지 AA)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
              required
            />
            <select
              value={person}
              onChange={(e) => setPerson(e.target.value)}
              className="w-24 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm bg-white font-medium"
            >
              {PERSONS.map(p => (
                <option key={p} value={p}>{p}</option>
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
        <div className="flex gap-2">
          <button
            onClick={() => setFilterPerson('전체')}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
              filterPerson === '전체' 
                ? 'bg-gray-800 text-white' 
                : 'bg-white border border-gray-200 text-gray-600'
            }`}
          >
            전체
          </button>
          {PERSONS.map(p => (
            <button
              key={p}
              onClick={() => setFilterPerson(p)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                filterPerson === p
                  ? 'bg-red-100 text-red-700 border border-red-200'
                  : 'bg-white border border-gray-200 text-gray-600'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-3 pb-20">
        {filteredItems.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">
            {items.length === 0 ? '목록이 비어있습니다.' : '검색 결과가 없습니다.'}
          </div>
        ) : (
          filteredItems.map(item => (
            <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-start group">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.person === '준기' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                  }`}>
                    {item.person}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {new Date(item.addedAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="font-medium text-gray-900">{item.name}</h3>
                {item.note && <p className="text-xs text-gray-500 mt-1">{item.note}</p>}
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
