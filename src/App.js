import React, { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import Photo from "./Photo";

const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`;
const mainUrl = `https://api.unsplash.com/photos/`;
const searchUrl = `https://api.unsplash.com/search/photos/`;

// function App() {
//   const [loading, setLoading] = useState(false);
//   const [photos, setPhotos] = useState([]);
//   const [page, setPage] = useState(1);
//   const [query,setQuery] = useState('')
//   const fetchImages = async () => {
//     setLoading(true);
//     let url;
//     const urlPage = `&page=${page}`;
//     const urlQuery = `&query=${query}`;
//     // console.log(urlQuery);

//     if (query){
//       url = `${searchUrl}${clientID}${urlPage}${urlQuery}`;
//       // console.log(url);
//     } else {
//       url = `${mainUrl}${clientID}${urlPage}`;
//     }

//     try {
//       const response = await fetch(url);
//       const data = await response.json();
//       console.log("data",data);
//       setPhotos((oldPhotos) => {
//         if (query && page === 1) {
//           console.log("query && page === 1");
//           return data.results;
//         } else if (query) {
//           console.log("query");
//           return [...oldPhotos, ...data.results];
//         }
//         else {
//           console.log("else")
//          return [...oldPhotos, ...data];
//         }
//         // console.log(oldPhotos)

//       });

//       setLoading(false);
//     } catch (error) {
//       setLoading(false);
//       console.log(error);
//     }
//   };
//   useEffect(() => {
//     fetchImages();
//     // eslint-disable-next-line
//   }, [page]);

//   useEffect(() => {
//     const event = window.addEventListener("scroll", () => {
//       // console.log(`innerHeight ${window.innerHeight}`);
//       // console.log(`scrollY ${window.scrollY}`);
//       // console.log(`body height ${document.body.scrollHeight}`);
//       if (
//         !loading &&
//         window.innerHeight + window.scrollY >= document.body.scrollHeight - 2
//       ) {
//         setPage((oldPage) => {
//           return oldPage + 1;
//         });
//       }
//     });

//     return window.removeEventListener("scroll", event);
//     // eslint-disable-next-line
//   }, []);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     fetchImages();
//   };
//   return (
//     <main>
//       <section className="search">
//         <form className="search-form">
//           <input type="text" placeholder="search" className="form-input" value={query} onChange={(e) => {
//             setQuery(e.target.value);
//           }} />
//           <button className="submit-btn" onClick={handleSubmit}>
//             <FaSearch />
//           </button>
//         </form>
//       </section>
//       <section className="photos">
//         <div className="photos-center">
//           {photos.map((image, index) => {
//             {
//               /* console.log(image)  */
//             }
//             return <Photo key={index} {...image} />;
//           })}
//         </div>
//         {loading && <h2 className="loading">Loading...</h2>}
//       </section>
//     </main>
//   );
// }

// export default App;

// remove current scroll code
// set default page to 1
// setup two useEffects
// don't run second on initial render
// check for query value
// if page 1 fetch images
// otherwise setPage(1)
// fix scroll functionality

function App() {
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const mounted = useRef(false);
  const [newImages, setNewImages] = useState(false);
  const fetchImages = async () => {
    setLoading(true);
    let url;
    const urlPage = `&page=${page}`;
    const urlQuery = `&query=${query}`;
    if (query) {
      url = `${searchUrl}${clientID}${urlPage}${urlQuery}`;
    } else {
      url = `${mainUrl}${clientID}${urlPage}`;
    }
    try {
      const response = await fetch(url);
      const data = await response.json();
      setPhotos((oldPhotos) => {
        if (query && page === 1) {
          return data.results;
        } else if (query) {
          return [...oldPhotos, ...data.results];
        } else {
          return [...oldPhotos, ...data];
        }
      });
      setNewImages(false);
      setLoading(false);
    } catch (error) {
      setNewImages(false);

      setLoading(false);
    }
  };
  useEffect(() => {
    fetchImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (!newImages) return;
    if (loading) return;
    setPage((oldPage) => oldPage + 1);
  }, [newImages]);

  const event = () => {
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) {
      setNewImages(true);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', event);
    return () => window.removeEventListener('scroll', event);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query) return;
    if (page === 1) {
      fetchImages();
    }
    setPage(1);
  };
  return (
    <main>
      <section className='search'>
        <form className='search-form'>
          <input
            type='text'
            placeholder='search'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className='form-input'
          />
          <button type='submit' className='submit-btn' onClick={handleSubmit}>
            <FaSearch />
          </button>
        </form>
      </section>
      <section className='photos'>
        <div className='photos-center'>
          {photos.map((image, index) => {
            return <Photo key={index} {...image} />;
          })}
        </div>
        {loading && <h2 className='loading'>Loading...</h2>}
      </section>
    </main>
  );
}

export default App;