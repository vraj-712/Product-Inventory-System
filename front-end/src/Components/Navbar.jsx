import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="w-full p-5">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem className="flex gap-6">
            <NavigationMenuLink asChild>
              <Link to="/add-product" className="text-lg font-bold">Add Product</Link>
            </NavigationMenuLink>
            <NavigationMenuLink asChild>
              <Link to="/" className="text-lg font-bold">Product List</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}

export default Navbar
