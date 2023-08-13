import React, { useContext, useEffect, useReducer, useState } from 'react'
import Navbar from './Components/Navbar'
import { movies } from '../Data/Data'
import { ProvideContext } from '../Context/ContextProvider'
import { useLocation, useNavigate } from 'react-router-dom'

const Home = () => {
    const navigate = useNavigate()
    const genre = movies.map(ele => ele.genre)
    const combinedArray = [].concat(...genre)
    const finalGenre = [...new Set(combinedArray)].filter(ele => ele != 'All')

    const nyear = movies.map(ele => ele.year)
    const combinedArrayTwo = [].concat(...nyear)
    const year = [...new Set(combinedArrayTwo)].filter(ele => ele != 'All')

    const nrating = movies.map(ele => ele.rating)
    const combinedArrayThree = [].concat(...nrating)
    const rating = [...new Set(combinedArrayThree)].filter(ele => ele != 'All')
    const [filters, setFilters] = useState(["All", "All", "All"])

    const { search, watch, star, setWatch, setStar } = useContext(ProvideContext)

    const getData = (data) => {
        console.log("Inside==>" + filters[0])
        const newData = [...data]
        const datTobereturned = movies.filter(ele => ele.genre.includes(filters[0]) && ele.year.includes(filters[1]) && ele.rating.includes(filters[2]))
        console.log("data to be returned ==>" + JSON.stringify(datTobereturned))
        return datTobereturned
    }



    const handleReducer = (state, action) => {
        switch (action.type) {
            case "set_data":
                return { ...state, data: getData(state.data) }
            case "add_movie":
                console.log("new Movie==>"+JSON.stringify(action.payload))
                return { ...state, data: [...state.data, ...action.payload], unAlteredData: [...state.unAlteredData, ...action.payload] }
            case "filter_data":
                return { ...state, data: action.payload }

            case "toggle_modal":
                return { ...state, open: !state.open }
        }
    }

    const [state, dispatch] = useReducer(handleReducer, { data: movies, unAlteredData: movies, open: false })

    const handleFilters = (val, index) => {
        console.log("vall==>" + val)
        const newFilter = [...filters]
        newFilter[index] = val
        setFilters(newFilter)
        dispatch({ type: "set_data" })
    }



    const location = useLocation()
    const movieElement = location?.state

    const removeFromStar = (id) => {
        const existingArrayJSON = localStorage.getItem("star");
        const existingArray = existingArrayJSON ? JSON.parse(existingArrayJSON) : [];

        const updatedArray =existingArray.filter(ele=>ele.id!=id) ;
        localStorage.setItem("star", JSON.stringify(updatedArray));
        setStar(star.filter(item => item.id != id))
    }

    const addToStar = (ele) => {
        const existingArrayJSON = localStorage.getItem("star");
        const existingArray = existingArrayJSON ? JSON.parse(existingArrayJSON) : [];

        const updatedArray = [...existingArray, ele];
        localStorage.setItem("star", JSON.stringify(updatedArray));
        setStar([...star, ele])
    }

    const removeFromWatch = (id) => {
        const existingArrayJSON = localStorage.getItem("watch");
        const existingArray = existingArrayJSON ? JSON.parse(existingArrayJSON) : [];

        const updatedArray =existingArray.filter(ele=>ele.id!=id) ;
        localStorage.setItem("watch", JSON.stringify(updatedArray));
        setWatch(watch.filter(item => item.id != id))
    }

    const addToWatch = (ele) => {
        const existingArrayJSON = localStorage.getItem("watch");
        const existingArray = existingArrayJSON ? JSON.parse(existingArrayJSON) : [];

        const updatedArray = [...existingArray, ele];
        localStorage.setItem("watch", JSON.stringify(updatedArray));
        setWatch([...watch, ele])
    }
    let counter = 20;

    const addMovie = (e) => {
        e.preventDefault();
        counter++;
        const movie = {
            id: counter,
            title: document.getElementById("title").value,
            year: [document.getElementById("year").value, 'All'],
            genre: [document.getElementById("genre").value, 'All'],
            rating: [document.getElementById("rating").value, 'All'],
            director: document.getElementById("director").value,
            writer: document.getElementById("writer").value,
            cast: document.getElementById("director").value,
            summary: document.getElementById("summary").value,
            imageURL: document.getElementById("imageUrl").value
        }

        const existingArrayJSON = localStorage.getItem("arr");
        const existingArray = existingArrayJSON ? JSON.parse(existingArrayJSON) : [];

        const updatedArray = [...existingArray, movie];
        localStorage.setItem("arr", JSON.stringify(updatedArray));
        dispatch({ type: "add_movie", payload: updatedArray });
        dispatch({ type: "toggle_modal" });
    }

    useEffect(() => {
        if (search.length > 0) {
            const newData = [...state.data]
            const returnedData = newData.filter(ele => ele.title.includes(search) || ele.director.includes(search))
            console.log("filterd data===>" + search)
            dispatch({ type: "filter_data", payload: returnedData })
        } else {
            dispatch({ type: "filter_data", payload: state.unAlteredData })
        }
    }, [search])

    useEffect(() => {
        const data = localStorage.getItem("arr")
        const watchData = localStorage.getItem("watch")
        const starData = localStorage.getItem("star")
        if (data != undefined) {
            const newData = JSON.parse(data)
            console.log("new Array==>" + JSON.stringify(newData))
            dispatch({ type: "add_movie", payload: newData })
        }
        if (watchData != undefined) {
            const newData = JSON.parse(watchData)
            console.log("new Array==>" + JSON.stringify(newData))
            setWatch([...watch, ...newData])
        }
        if (starData != undefined) {
            const newData = JSON.parse(starData)
            console.log("new Array==>" + JSON.stringify(newData))
            setStar([...star, ...newData])
        }
    }, [])

    if (location.pathname == "/singlePage") {
        return (
            <>
                <Navbar />
                <div>
                    <section class="text-black-600 body-font overflow-hidden ">
                        <div class="container px-5 py-24 mx-auto">
                            <div class="lg:w-4/5 mx-auto flex flex-wrap shadow-xl">
                                <img alt="ecommerce" class="lg:w-1/2 w-full lg:h-96 h-64 object-cover object-center rounded" src={movieElement.imageURL} />
                                <div class="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
                                    <h1 class="text-gray-900 text-3xl title-font font-medium mb-1">{movieElement.title}</h1>
                                    <p class="leading-relaxed">{movieElement.summary}</p>
                                    <div className='flex flex-col text-left h-60 justify-between'>
                                        <h1>Year: {movieElement.year.filter(o => o != "All")}</h1>
                                        <h1>Genre: {movieElement.genre.filter(o => o != "All")}</h1>
                                        <h1>Rating: {movieElement.rating.filter(o => o != "All")}</h1>
                                        <h1>Director: {movieElement.director}</h1>
                                        <h1>Writer: {movieElement.writer}</h1>
                                        <h1>Writer: {movieElement.cast}</h1>

                                        <div className='flex justify-between w-96'>
                                            {
                                                star.find((f) => f.id == movieElement.id) == undefined ?
                                                    <button className='p-2 bg-stone-600 cursor-pointer text-white rounded'
                                                        onClick={() => addToStar(movieElement)}
                                                    >Star</button>
                                                    :
                                                    <button className='p-2 bg-stone-600 cursor-pointer text-white rounded'
                                                        onClick={() => removeFromStar(movieElement.id)}
                                                    >Starred</button>
                                            }
                                            {
                                                watch.find((f) => f.id == movieElement.id) == undefined ?
                                                    <button className='p-2 bg-stone-600 cursor-pointer text-white rounded'
                                                        onClick={() => removeFromWatch(movieElement.id)}
                                                    >Add to watchList</button>
                                                    :
                                                    <button className='p-2 bg-stone-600 cursor-pointer text-white rounded'
                                                        onClick={() => addToWatch(movieElement.id)}
                                                    >Remove from watchList</button>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </>
        )
    }
    else {
        return (
            <div>
                <Navbar />
                <div className='mt-4'>
                    {
                        location.pathname == "/" ?
                            <div className='p-4 flex justify-between'>
                                <h1 className='font-bold text-xl'>Movies</h1>
                                <select className='border' onChange={(e) => handleFilters(e.target.value, 0)}>
                                    <option value="All">All Genre</option>
                                    {
                                        finalGenre.map(ele => <option value={ele}>{ele}</option>)
                                    }
                                </select>
                                <select className='border' onChange={(e) => handleFilters(e.target.value, 1)}>
                                    <option value="All">Release year</option>
                                    {
                                        year.map(ele => <option value={ele}>{ele}</option>)
                                    }
                                </select>
                                <select className='border' onChange={(e) => handleFilters(e.target.value, 2)}>
                                    <option value="All">Rating</option>
                                    {
                                        rating.map(ele => <option value={ele}>{ele}</option>)
                                    }
                                </select>

                                <button className='p-2 bg-stone-700 text-white rounded'
                                    onClick={(e) => {
                                        dispatch({ type: "toggle_modal" })
                                    }}
                                >Add a Movie</button>
                            </div>
                            : ""
                    }

                    <section class="text-gray-600 body-font">
                        <div class="container px-5 py-24 mx-auto">
                            <div class="flex flex-wrap -m-4">
                                {
                                    (location.pathname == "/" ? state.data : ((location.pathname == "/starred" ? star : watch)))?.map(ele =>
                                        <div class="p-4 md:w-1/3 text-black">
                                            <div class="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
                                                <img class="lg:h-48 md:h-36 w-full object-cover object-center cursor-pointer" src={ele.imageURL} alt="movie"
                                                    onClick={() => navigate("/singlePage",
                                                        { state: ele })}
                                                />
                                                <div class="p-6 ">
                                                    <div className='h-40'>
                                                        <h1 class="title-font text-lg font-medium mb-3 font-medium">{ele.title}</h1>
                                                        <p class="leading-relaxed mb-3 font-bold">{ele.summary}</p>
                                                    </div>
                                                    <div class="flex w-80 justify-between mx-auto ">
                                                        {
                                                            star.find((f) => f.id == ele.id) == undefined ?
                                                                <button className='p-2 bg-stone-600 cursor-pointer text-white rounded'
                                                                    onClick={() => addToStar(ele)}
                                                                >Star</button>
                                                                :
                                                                <button className='p-2 bg-stone-600 cursor-pointer text-white rounded'
                                                                    onClick={() => removeFromStar(ele.id)}
                                                                >Starred</button>
                                                        }
                                                        {
                                                            watch.find((f) => f.id == ele.id) == undefined ?
                                                                <button className='p-2 bg-stone-600 cursor-pointer text-white rounded'
                                                                    onClick={() => addToWatch(ele)}
                                                                >Add to watchList</button>
                                                                :
                                                                <button className='p-2 bg-stone-600 cursor-pointer text-white rounded'
                                                                    onClick={() => removeFromWatch(ele.id)}
                                                                >Remove from watchList</button>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    )
                                }
                            </div>
                        </div>
                    </section>

                    <div class={state.open ? "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" : "hidden"}>
                        <div class="bg-white rounded-lg p-6 max-w-md w-full max-h-screen overflow-y-auto">
                            <h2 class="text-xl font-semibold mb-4">Add Movie</h2>
                            <form>

                                <div class="mb-4">
                                    <label class="block font-medium mb-1" for="name">Title</label>
                                    <input class="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500" type="text" id="title" name="name" />
                                </div>
                                <div>
                                    <label>Genre</label>
                                    <select className='border' id='genre'>

                                        {
                                            finalGenre.map(ele => <option value={ele}>{ele}</option>)
                                        }
                                    </select>

                                    <label>Year</label>
                                    <select className='border' id='year'>

                                        {
                                            year.map(ele => <option value={ele}>{ele}</option>)
                                        }
                                    </select>
                                    <label>Rating</label>
                                    <select className='border' id='rating'>

                                        {
                                            rating.map(ele => <option value={ele}>{ele}</option>)
                                        }
                                    </select>
                                </div>
                                <div class="mb-4">
                                    <label class="block font-medium mb-1" for="name">director</label>
                                    <input class="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500" type="text" id="director" name="director" />
                                </div>
                                <div class="mb-4">
                                    <label class="block font-medium mb-1" for="description">Cast</label>
                                    <textarea class="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500" id="cast" name="cast"></textarea>
                                </div>
                                <div class="mb-4">
                                    <label class="block font-medium mb-1" for="description">Writer</label>
                                    <textarea class="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500" id="writer" name="writer"></textarea>
                                </div>
                                <div class="mb-4">
                                    <label class="block font-medium mb-1" for="price">Summary</label>
                                    <input class="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500" type="text" id="summary" name="summary" />
                                </div>
                                <div class="mb-4">
                                    <label class="block font-medium mb-1" for="stock">Image Url</label>
                                    <input class="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500" type="text" id="imageUrl" name="imageUrl" />
                                </div>
                                <div class="flex justify-end mt-6">
                                    <button class="px-4 py-2 bg-stone-500 text-white rounded hover:bg-stone-600 focus:outline-none" type="submit"
                                        onClick={(e) => addMovie(e)}
                                    >Add Movie</button>
                                    <button class="px-4 py-2 ml-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none" type="button"
                                        onClick={() => dispatch({ type: "toggle_modal" })}
                                    >Close</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Home