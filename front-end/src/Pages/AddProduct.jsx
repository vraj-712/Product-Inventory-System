import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { axiosInstance } from "../utils/axiosHelper"
import { ToastContainer, toast } from 'react-toastify';

const AddProduct = () => {
 const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
    description: "",
    category: [],
  })

  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [categories, setCategories] = useState([])
  const [loader, setLoader] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleCategoryToggle = (category) => {
    setFormData((prev) => ({
      ...prev,
      category: prev.category.find(item => item?.value === category?.value)?.value != undefined
        ? prev.category.filter((c) => c?.value !== category?.value)
        : [...prev.category, category],
    }))
  }

  const isFormValid = () => {
    return (
      formData.name.trim() !== "" &&
      formData.price.trim() !== "" &&
      formData.quantity.trim() !== "" &&
      formData.description.trim() !== "" &&
      formData.category.length > 0
    )
  }

  const handleSubmit = async (e) => {
    setLoader(true);
    e.preventDefault()
    if (isFormValid()) {
      console.log("Form submitted:", formData)
      const response = await axiosInstance.post('/products/add-product', formData)
      if(response.status == 201){
        toast.success("Product added successfully!")
        setFormData({
          name: "",
          price: "",
          quantity: "",
          description: "",
          category: [],
        })
      } else {
        toast.error("Failed to add product: " + response.message)
      }
    } else {
      toast.error("Error while submitting the form. Please try again later.")
    }
    setLoader(false);
  }

  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCategoryOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const loadCategoryData = async () => {
      const response = await axiosInstance.get('/categories/get-categories');
      console.log(response)
      if (response.status === 200) {
        const modifiedCategories = response.data.map((cat) => ({
          value: cat._id,
          label: cat.name}))
        setCategories(modifiedCategories || [])
      } else {
        console.error("Failed to fetch categories:", response.message)
      }
    }
    loadCategoryData()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-lg border-2 border-gray-200">
        <CardHeader className="bg-gradient-to-r from-blue-300 to-indigo-300 rounded-t-xl border-b">
          <CardTitle className="text-3xl font-bold text-gray-800 text-center">Add Product</CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                Product Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter product name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
            </div>

            {/* Price and Quantity Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm font-semibold text-gray-700">
                  Price (&#8377;) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-sm font-semibold text-gray-700">
                  Quantity <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange("quantity", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                />
              </div>
            </div>

            {/* Category - Multi Select */}
            <div className="space-y-2" ref={dropdownRef}>
              <Label htmlFor="category" className="text-sm font-semibold text-gray-700">
                Categories <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-left bg-white flex justify-between items-center"
                >
                  <span className="text-gray-700">
                    {formData.category.length === 0 ? "Select categories" : `${formData.category.length} selected`}
                  </span>
                  <svg
                    className={`w-5 h-5 transition-transform ${isCategoryOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isCategoryOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {categories.length > 0 && categories.map((option) => (
                      <label key={option.value} className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.category.find(item => item.value === option.value) != undefined ? true : false}
                          onChange={() => handleCategoryToggle(option)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-3 text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Categories Display */}
              {formData.category.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.category.map((cat) => (
                    <span
                      key={cat?.value}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      {cat?.label?.charAt(0).toUpperCase() + cat?.label.slice(1).replace("-", " & ")}
                      <button
                        type="button"
                        onClick={() => handleCategoryToggle(cat)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Enter product description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 min-h-[120px] resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={!isFormValid()}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-white text-lg transition-all duration-300 transform ${
                  isFormValid()
                    ? "bg-green-600 hover:bg-green-700 hover:scale-105 shadow-lg hover:shadow-xl"
                    : "bg-gray-400 cursor-not-allowed opacity-60"
                }`}
              >
                {!loader ? isFormValid() ? "Add Product" : "Add Product": "Adding..."}
              </Button>
            </div>

            {/* Required Fields Note */}
            <p className="text-sm text-red-500 text-center mt-4">* All fields are required</p>
          </form>
        </CardContent>
      </Card>
      <ToastContainer />
    </div>
  )
}

export default AddProduct
