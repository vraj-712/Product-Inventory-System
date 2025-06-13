import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Trash2, Search, Filter } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { axiosInstance } from "../utils/axiosHelper"
import { ToastContainer, toast } from 'react-toastify';


const Listing = () => {
  const [products, setProducts] = useState([])
  const [allCategories, setAllCategories] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [refresh, setRefresh] = useState(false)
  const [pageArr, setPageArr] = useState([])

  useEffect(() => {
    if(search) {
      setPage(1)
    }
    const fetchProducts = async () => {
      const response = await axiosInstance.get("/products", {
        params: {
          page,
          limit,
          search,
          categories: selectedCategories,
        },
      })
      if (response.status === 200) {
        toast.success("Products fetched Successfully.")
        setProducts(response.data.products)
        setTotalProducts(response.data.totalProducts)
        setTotalPages(Math.ceil(response.data.totalProducts / limit))
      } else {
        toast.success("Error while Fetching Product.")
      }
    }
    fetchProducts()
  }, [search, selectedCategories, page, limit, refresh])

  useEffect(() => {
     const fetchAllCategories = async () => {
      const response = await axiosInstance.get('/categories/get-categories');
      if (response.status === 200) {
        setAllCategories(response.data)
      } else {
        console.error("Failed to fetch categories:", response.serverDefaultText)
      }
    }
    fetchAllCategories()  
  }, [])

  useEffect(() => {
    let arr = Array.from({ length: totalPages }, (_, i) => i + 1)
    let newArr = arr.slice(page - 1, page + 2);
   setPageArr(newArr)
  },[totalPages, page])

  // Handle product deletion
  const handleDelete = async (id) => {
    const response = await axiosInstance.delete(`/products/delete-product/${id}`);
    if(response.status == 200) {
      toast.success(response.message);
      setRefresh(prev => !prev)
    } else {
      toast.error(response.message)
    }
  }

  // Format price to currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
    }).format(price)
  }

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = String(d.getFullYear()).slice(-2); // Get last 2 digits of year
    return `${day}/${month}/${year}`;
  }



  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Product Inventory</h1>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 border-2 border-gray-200"
              />
            </div>

            {/* Category Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-2 border-gray-200 flex gap-2">
                  <Filter size={18} />
                  <span className="hidden sm:inline">Filter by Category</span>
                  {selectedCategories.length > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {selectedCategories.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {allCategories.map((category) => (
                  <DropdownMenuCheckboxItem
                    key={category._id}
                    checked={selectedCategories.includes(category._id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedCategories([...selectedCategories, category._id])
                      } else {
                        setSelectedCategories(selectedCategories.filter((c) => c !== category._id))
                      }
                    }}
                  >
                    {category?.name}
                  </DropdownMenuCheckboxItem>
                ))}
                {selectedCategories.length > 0 && (
                  <Button variant="ghost" size="sm" className="w-full mt-2" onClick={() => setSelectedCategories([])}>
                    Clear Filters
                  </Button>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {(page - 1 ) * limit + 1 } - {(page - 1 ) * limit + products.length} of {totalProducts} products
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <Card
                key={product._id}
                className="overflow-hidden border-2 border-gray-200 transition-all duration-300 hover:shadow-lg"
              >
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <h2 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h2>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(product._id)}
                      >
                        <Trash2 size={18} />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                        {formatPrice(product.price)}
                      </div>
                      <div className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">
                        Quantuty: {product.quantity}
                      </div>
                    </div>
                    <p className="text-gray-600 my-2 line-clamp-2 text-sm">{formatDate(product?.createdAt)}</p>

                    <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>

                    <div className="flex flex-wrap gap-2">
                      {product?.categories?.map((cat) => (
                        <Badge key={cat._id} variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                          {cat.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-gray-100 p-4 rounded-full mb-4">
                <Search size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-1">No products found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
      {/* Pagination */}
      <Pagination className="mt-8">
        <PaginationContent>
          {page>1 && <PaginationItem>
            <PaginationPrevious onClick={() => setPage(page-1)} />
          </PaginationItem>}
          {
            pageArr.map((pageNum) => (
              <PaginationItem key={pageNum}>
                <PaginationLink  isActive={page == pageNum} onClick={() => setPage(pageNum)}>
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            ))
          }
          {page < totalPages && <PaginationItem>
            <PaginationNext onClick={() => setPage(page+1)} />
          </PaginationItem>}
        </PaginationContent>
      </Pagination>
      <ToastContainer />
    </div>
  )
}

export default Listing
