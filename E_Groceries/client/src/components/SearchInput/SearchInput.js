import React from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useSearch } from '../../context/search'

const SearchInput = () => {
    const [values, setValues] = useSearch()
//    console.log(values)
    const navigate = useNavigate()
    const handleSubmit = async(event) =>{
        event.preventDefault()
        try {
            const {data} = await axios.get(`http://localhost:8089/api/products/search/${values.keyword}`)
            console.log(data.matchingProducts)
            setValues({...values, matchingProducts: data.matchingProducts})
            navigate('/search')
            setValues({keyword: "", matchingProducts: data.matchingProducts})
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <div>
      {" "}
      <form className="d-flex" role="search" onSubmit={handleSubmit}>
        <input
          className="form-control me-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
          required
          value={values.keyword}
          onChange={(event) =>{setValues({...values, keyword: event.target.value})}}
        />
        <button className="btn" type="submit" style={{width:"40px", border:"none"}}>
          <img
                    src={require("../../assets/search.png")}
                    alt="Logo"
                    className="imgSearch"
                    style={{width:"25px", height:"25px"}}
                  />
        </button>
      </form>
    </div>
  );
}

export default SearchInput