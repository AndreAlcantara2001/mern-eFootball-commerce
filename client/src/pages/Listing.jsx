import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import { Navigation } from 'swiper/modules'
import 'swiper/css/bundle';

export const Listing = () => {
    SwiperCore.use([Navigation])
    const [listing, setListing] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
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
                            <div className="h-[500px]" style={{background: `url(${imageUrl}) center no-repeat`, backgroundSize: 'cover'}}>

                            </div>
                        </SwiperSlide>
                    )
                    )}
                </Swiper>
                </>
            )}

        </main>
    )
}
