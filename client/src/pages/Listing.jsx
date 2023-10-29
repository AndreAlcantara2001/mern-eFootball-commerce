import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import { Navigation } from 'swiper/modules'
import 'swiper/css/bundle';
import Contact from '../components/Contact';
import efotEpic from '../assets/efootballEpic.png'
import efotPotw from '../assets/efootballPotw.png'
import efotBigTime from '../assets/efootballBigTime.jpg'
import efotShowTime from '../assets/efootballshowTime.png'
import efotLegend from '../assets/efootballLegend.png'
import {
  FaPhoneAlt,
  FaRegTimesCircle,
  FaShare,
} from 'react-icons/fa';
import { useSelector } from 'react-redux'

export const Listing = () => {
  SwiperCore.use([Navigation])
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [copied, setCopied] = useState(false);
  const { currentUser } = useSelector(state => state.user)
  const [contact, setContact] = useState(false);
  const params = useParams()
  useEffect(() => {
    const fetchListing = async () => {

      try {
        setLoading(true)
        const res = await fetch(`/api/listing/get/${params.id}`, {
          method: 'GET'
        })

        const data = await res.json()
        if (data.success === false) {
          setLoading(false)
          setError(true)
          return;
        }

        setListing(data)
        setLoading(false)
        setError(false)
      } catch (err) {
        setLoading(false)
        setError(true)
      }

    }

    fetchListing()
  }, [params.id])

  return (
    <main>
      {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
      {error && <p className='text-center my-7 text-2xl'>Something went wrong!</p>}

      {listing && !loading && !error && (
        <>
          <Swiper navigation>
            {listing.imageUrls.map((imageUrl) => (
              <SwiperSlide key={imageUrl}>
                <div className="h-[200px] sm:h-[500px]" style={{ background: `url(${imageUrl}) center no-repeat`, backgroundSize: 'contain' }}>

                </div>
              </SwiperSlide>
            )
            )}
          </Swiper>
          <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
            <FaShare
              className='text-slate-500'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 1000);
              }}
            />
          </div>
          {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-300 p-2'>
              Link copied!
            </p>
          )}
          <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
            <p className='text-2xl font-semibold'>
              {listing.name} - ${' '}
              {listing.offer
                ? listing.discountPrice.toLocaleString('en-US')
                : listing.regularPrice.toLocaleString('en-US')}
              {listing.type === 'rent' && ' / month'}
            </p>
            <p className='flex items-center gap-2 text-slate-600'>
              <FaPhoneAlt className='text-green-700 h-4 w-4' />
              {listing.phone}
            </p>
            <div className='flex gap-4'>
              <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md flex justify-center items-center font-semibold'>
                {listing.type === 'trade' ? 'For Trading' : 'For Sale'}
              </p>
              {listing.offer && (
                <div className='bg-green-700 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                  <p style={{ textDecoration: 'line-through' }}>
                    ${listing.regularPrice}
                  </p>
                  <p>
                    ${listing.discountPrice} <span className='text-yellow-500 font-bold'>Now!</span>
                  </p>
                </div>
              )}
            </div>
            <p className='text-slate-800'>
              <span className='font-semibold text-black'>Description - </span>
              {listing.description}
            </p>
            <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <img src={efotEpic} alt='Epics' className='h-12 w-12 object-contain rounded-lg' />
                {listing.epics > 0
                  ? `${listing.epics} Epic`
                  : (<FaRegTimesCircle className='bg-red-500 text-white rounded-lg' />)}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <img src={efotBigTime} alt='Bigtimes' className='h-12 w-12 object-contain rounded-lg' />
                {listing.bigtimes > 0
                  ? `${listing.bigtimes} Big Time`
                  : (<FaRegTimesCircle className='bg-red-500 text-white rounded-lg' />)}
              </li>

              <li className='flex items-center gap-1 whitespace-nowrap '>
                <img src={efotShowTime} alt='Showtimes' className='h-12 w-12 object-contain rounded-lg' />
                {listing.showtimes > 0
                  ? `${listing.showtimes} Showtime`
                  : (<FaRegTimesCircle className='bg-red-500 text-white rounded-lg' />)}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <img src={efotPotw} alt='Potw' className='h-12 w-12 object-contain rounded-lg' />
                {listing.potws > 0
                  ? `${listing.potws} POTW`
                  : (<FaRegTimesCircle className='bg-red-500 text-white rounded-lg' />)}
              </li>

              <li className='flex items-center gap-1 whitespace-nowrap '>
                <img src={efotLegend} alt='Legend' className='h-12 w-12 object-contain rounded-lg' />
                {listing.legends > 0
                  ? `${listing.legends} Legend`
                  : (<FaRegTimesCircle className='bg-red-500 text-white rounded-lg' />)}
              </li>

            </ul>
            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3'
              >
                Contact landlord
              </button>
            )}
            {contact && <Contact listing={listing} />}
          </div>
        </>
      )}

    </main>
  )
}
