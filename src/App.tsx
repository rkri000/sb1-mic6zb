import React, { useState, useCallback, useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import { DollarSign, Users, TrendingUp, Activity } from 'lucide-react'
import ErrorBoundary from './ErrorBoundary'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

const initialData = [
  { name: 'Jan', 'Product A': 4000, 'Product B': 2400, 'Product C': 1800 },
  { name: 'Feb', 'Product A': 3000, 'Product B': 1398, 'Product C': 2800 },
  { name: 'Mar', 'Product A': 2000, 'Product B': 9800, 'Product C': 3200 },
  { name: 'Apr', 'Product A': 2780, 'Product B': 3908, 'Product C': 1908 },
  { name: 'May', 'Product A': 1890, 'Product B': 4800, 'Product C': 2400 },
  { name: 'Jun', 'Product A': 2390, 'Product B': 3800, 'Product C': 2980 },
]

const products = ['Product A', 'Product B', 'Product C']

const KPICard = ({ title, value, icon: Icon }) => (
  <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
    <div className="mr-4">
      <Icon size={24} className="text-blue-500" />
    </div>
    <div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="text-2xl font-bold text-blue-600">{value}</p>
    </div>
  </div>
)

function App() {
  const [selectedProduct, setSelectedProduct] = useState(null)

  const filteredData = useMemo(() => {
    if (!selectedProduct) return initialData
    return initialData.map(item => ({
      name: item.name,
      [selectedProduct]: item[selectedProduct]
    }))
  }, [selectedProduct])

  const barChartData = useMemo(() => {
    return products.map(product => ({
      name: product,
      value: initialData.reduce((sum, item) => sum + item[product], 0)
    }))
  }, [])

  const pieChartData = useMemo(() => {
    return barChartData.map(item => ({
      name: item.name,
      value: item.value
    }))
  }, [barChartData])

  const handleProductClick = useCallback((data) => {
    setSelectedProduct(prevProduct => prevProduct === data.name ? null : data.name)
  }, [])

  const selectedProductRevenue = useMemo(() => {
    if (!selectedProduct) {
      return barChartData.reduce((sum, item) => sum + item.value, 0)
    }
    return barChartData.find(item => item.name === selectedProduct)?.value || 0
  }, [selectedProduct, barChartData])

  const activeProduct = selectedProduct || 'All'
  const conversionRate = Math.round((selectedProductRevenue / barChartData.reduce((sum, item) => sum + item.value, 0)) * 100)

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard title="Total Revenue" value={`$${selectedProductRevenue.toLocaleString()}`} icon={DollarSign} />
        <KPICard title="Active Products" value={activeProduct} icon={Users} />
        <KPICard title="Product Focus" value={`${conversionRate}%`} icon={TrendingUp} />
        <KPICard title="Total Products" value={products.length} icon={Activity} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ErrorBoundary>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Product Performance Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {(selectedProduct ? [selectedProduct] : products).map((product, index) => (
                  <Line key={product} type="monotone" dataKey={product} stroke={COLORS[index]} activeDot={{ r: 8 }} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ErrorBoundary>
        
        <ErrorBoundary>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Total Product Performance</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" onClick={handleProductClick}>
                  {barChartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={selectedProduct === entry.name ? '#82ca9d' : COLORS[index % COLORS.length]}
                      opacity={selectedProduct && selectedProduct !== entry.name ? 0.3 : 1}
                      cursor="pointer"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ErrorBoundary>
        
        <ErrorBoundary>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Product Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  onClick={handleProductClick}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={selectedProduct === entry.name ? '#82ca9d' : COLORS[index % COLORS.length]}
                      opacity={selectedProduct && selectedProduct !== entry.name ? 0.3 : 1}
                      cursor="pointer"
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App