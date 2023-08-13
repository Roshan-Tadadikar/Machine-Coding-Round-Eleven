import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { ProvideContext } from '../../Context/ContextProvider'
import { Link } from 'react-router-dom'

const Navbar = () => {
    const{setSearch} = useContext(ProvideContext)
    const navigate = useNavigate()
    const filterBySearch=(val)=>{
        setSearch(val)
        navigate('/')
    }

  return (
    <div>
        <div className='bg-stone-700 p-4 flex text-white justify-between'>
        <h1 className='text-xl font-bold'>IMDB</h1>
        <div>
            <input type='search' placeholder='Search movie by title,cast and director ' className='p-2 w-96 rounded text-black'
            onChange={(e)=>filterBySearch(e.target.value)}
            />
        </div>
        <div className='flex w-96 justify-between'>
            <Link to="/"><li className='cursor-pointer font-medium list-none'>Movies</li>        </Link>
            <Link to="/watchList"><li className='cursor-pointer font-medium list-none'>Watch List</li></Link>
            <Link to="/starred"><li className='cursor-pointer font-medium list-none'>Starred Movies</li></Link>
        </div>
        </div>
    </div>
  )
}

export default Navbar