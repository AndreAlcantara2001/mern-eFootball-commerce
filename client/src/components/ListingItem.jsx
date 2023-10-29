import React from 'react'
import { FaCheckCircle, FaPhoneAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import efotEpic from '../assets/efootballEpic.png'
import efotLegend from '../assets/efootballLegend.png'
import efotBigTime from '../assets/efootballBigTime.jpg'
import efotShowTime from '../assets/efootballshowTime.png'

export default function ListingItem({ listing }) {
    return (
        <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[450px]">
            <Link to={`/listing/${listing._id}`}>
                <img src={listing.imageUrls[0]} alt="listing cover" className="h-[220px] sm:h-[270px] w-full object-cover hover:scale-105 transition-scale duration-300" />

                <div className="p-3 flex flex-col gap-2 w-full mt-2">
                    <p className="truncate text-lg font-semibold text-slate-800 capitalize">{listing.name}</p>

                    <div className="flex gap-4 flex-wrap my-1">
                        <div className="">{listing.epics > 0 &&
                            (
                                <div className='flex items-center gap-2'>
                                    <img src={efotEpic} alt='Epic' className='h-7 w-7 object-cover rounded-lg' />
                                    <FaCheckCircle className='h-4 w-4 text-green-500' />
                                </div>
                            )
                        }
                        </div>
                        <div className="">{listing.showtimes > 0 &&
                            (
                                <div className='flex items-center gap-2'>
                                    <img src={efotShowTime} alt='Show Time' className='h-7 w-7 object-cover rounded-lg' />
                                    <FaCheckCircle className='h-4 w-4 text-green-500' />
                                </div>
                            )
                        }
                        </div>
                        <div className="">{listing.bigtimes > 0 &&
                            (
                                <div className='flex items-center gap-2'>
                                    <img src={efotBigTime} alt='Big Time' className='h-7 w-7 object-cover rounded-lg' />
                                    <FaCheckCircle className='h-4 w-4 text-green-500' />
                                </div>
                            )
                        }
                        </div>
                        <div className="">{listing.legends > 0 &&
                            (
                                <div className='flex items-center gap-2'>
                                    <img src={efotLegend} alt='Legend' className='h-7 w-7 object-cover rounded-lg' />
                                    <FaCheckCircle className='h-4 w-4 text-green-500' />
                                </div>
                            )
                        }
                        </div>

                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2">{listing.description}</p>

                    {listing.type === 'sale' ? (<div className="text-slate-500 font-semibold">
                        {listing.offer ? <div className="">
                            <p className='line-through'>${listing.regularPrice.toLocaleString('en-US')}</p>
                            <p className='text-red-500'>${listing.discountPrice.toLocaleString('en-US')} <span className='text-black text-lg'>Now!</span></p>
                        </div>
                            : <div className=""><p>${listing.regularPrice.toLocaleString('en-US')}</p></div>}
                    </div>) :
                        (<p className="text-green-500 mt-2 font-semibold">Trade</p>)
                    }


                </div>


            </Link>
        </div>
    )
}
