import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';

export default function Home() {
  const [introPhotos] = useState([
    {
      id: 1,
      imageUrl: "https://wallpapercave.com/dwp1x/wp8568589.jpg",
    },
    {
      id: 2,
      imageUrl: "https://wallpapercave.com/dwp1x/wp8568589.jpg",
    },

    {
      id: 3,
      imageUrl: "https://wallpapercave.com/dwp1x/wp8568589.jpg",
    },

  ])
  const [offerListings, setOfferListings] = useState([])
  const [saleListings, setSaleListings] = useState([])
  const [tradeListings, setTradeListings] = useState([])
  SwiperCore.use([Navigation])


  useEffect(() => {
      const fetchOfferListings = async () => {
       try {
         const res = await fetch('/api/listing/get?offer=true&limit=4')
         const data = await res.json();
         setOfferListings(data)
         fetchTradeListings()
       } catch (err) {
         console.log(err)
       }
     } 
    const fetchTradeListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=trade&limit=4')
        const data = await res.json();
        setTradeListings(data)
        fetchSaleListings()
      } catch (err) {
        console.log(err)
      }
    }

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4')
        const data = await res.json();
        setSaleListings(data)
      } catch (err) {
        console.log(err)
      }
    }

    fetchTradeListings()
  }, [])

  return (
    <div>

      {/* top */}
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">Find your <span className='text-slate-500'>perfect</span> <br />EFootball account with ease</h1>

        <div className="text-gray-400 text-xs sm:text-sm">
          GG Game Commerce is the best palce to find your perfect efootball account to enjoy
          <br />
          We have a wide range of account type for you to choose from.
        </div>

        <Link className='text-xs sm:text-sm text-blue-800 font-bold hover:underline' to={`/search`}>
          Let's get started...
        </Link>
      </div>

      {/* swiper */}
      <Swiper navigation className='mx-auto'>

        {
          introPhotos && introPhotos.length > 0 && (
            introPhotos.map((photo) => (
              <SwiperSlide key={photo.id}>
                <div style={{ background: `url(${photo.imageUrl}) center no-repeat`, backgroundSize: 'contain' }} className="h-[300px] w-[500px] sm:h-[650px] sm:w-full" ></div>
              </SwiperSlide>
            ))
          )
        }

      </Swiper>


      {/* listing result for offer, sale and trade */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {
          offerListings && offerListings.length > 0 && (
            <div className="">
              <div className="my-3">
                <h2 className='text-2xl font-semibold text-slate-600'>Recent Offers</h2>
                <Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>
                  Show more offers
                </Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {
                  offerListings.map((listing) => (
                    <ListingItem listing={listing} key={listing._id} />
                  ))
                }
              </div>
            </div>
          )
        }

        {
          tradeListings && tradeListings.length > 0 && (
            <div className="">
              <div className="my-3">
                <h2 className='text-2xl font-semibold text-slate-600'>Recent Trades</h2>
                <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=trade'}>
                  Show more trades
                </Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {
                  tradeListings.map((listing) => (
                    <ListingItem listing={listing} key={listing._id} />
                  ))
                }
              </div>
            </div>
          )
        }
        {
          saleListings && saleListings.length > 0 && (
            <div className="">
              <div className="my-3">
                <h2 className='text-2xl font-semibold text-slate-600'>Recent Sale</h2>
                <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=sale'}>
                  Show more sales
                </Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {
                  saleListings.map((listing) => (
                    <ListingItem listing={listing} key={listing._id} />
                  ))
                }
              </div>
            </div>
          )
        }
      </div>


    </div>
  )
}
