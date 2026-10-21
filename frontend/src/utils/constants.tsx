import { GiClothes } from 'react-icons/gi'
import { MdOutlineSmartToy } from 'react-icons/md'
import { FaBaby } from 'react-icons/fa'

export const links = [
  {
    id: 1,
    text: 'home',
    url: '/',
  },
  {
    id: 2,
    text: 'shipping',
    url: '/shipping',
  },
  {
    id: 3,
    text: 'products',
    url: '/products',
  },
   {
    id: 4,
    text: 'blogs',
    url: '/blogs',
  },
   {
    id: 4,
    text: 'wishlist',
    url: '/wishlist',
  },
]

export const services = [
  {
    id: 1,
    icon: <MdOutlineSmartToy />,
    title: 'toy',
    text: 'toy text',
  },
  {
    id: 2,
    icon: <GiClothes />,
    title: 'clothing',
    text: 'clothing text',
  },
  {
    id: 3,
    icon: <FaBaby />,
    title: 'accessories',
    text: 'accessories text',
  },
]

// shown for products that don't have an image_url set
export const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><rect width='100%25' height='100%25' fill='%23e2e2e2'/><text x='50%25' y='50%25' font-size='20' text-anchor='middle' fill='%23888' dy='.3em'>No Image</text></svg>"
