'use client';

import { useState } from 'react';

export default function MealPlanPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    diet: '',
    calories: '',
    allergies: '',
    cuisine: '',
    includeSnacks: false,
  });

  const [result, setResult] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const res = await fetch('/api/generate-meal-plan', {
      method: 'POST',
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    setResult(data.mealPlan || null);
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">AI Meal Planner</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="diet" placeholder="e.g. Vegan, Keto" onChange={handleChange} className="input" />
        <input name="calories" placeholder="Calories per day (e.g. 2000)" onChange={handleChange} className="input" />
        <input name="allergies" placeholder="Allergies (e.g. nuts, dairy)" onChange={handleChange} className="input" />
        <input name="cuisine" placeholder="Cuisine preference (e.g. Italian)" onChange={handleChange} className="input" />
        <label>
          <input type="checkbox" name="includeSnacks" onChange={handleChange} />
          Include snacks
        </label>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Meal Plan'}
        </button>
      </form>

      {result && (
        <div className="mt-6 space-y-4">
          <h2 className="text-xl font-bold">Your 7-Day Meal Plan</h2>
          {Object.entries(result).map(([day, meals]: any) => (
            <div key={day}>
              <h3 className="font-semibold">{day}</h3>
              <ul className="ml-4 list-disc">
                {Object.entries(meals).map(([mealType, text]: any) => (
                  <li key={mealType}>
                    <strong>{mealType}:</strong> {text}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
