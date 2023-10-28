import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Contact({ listing }) {
    const [owner, setOwner] = useState(null)
    const [message, setMessage] = useState('')

    const onChangeMessage = (e) => {
        setMessage(e.target.value)
    }

    useEffect(() => {

        const fetchOwner = async () => {
            try {
                const res = await fetch(`/api/user/${listing.userRef}`,
                    {
                        method: 'GET'
                    })
                const data = await res.json()
                setOwner(data)
            } catch (err) {
                console.log(err.message)
            }
        }

        fetchOwner()

    }, [listing.userRef])



    return (
        <>
            {owner && (
                <div className=" flex flex-col gap-2">
                    <p >Contact <span className="font-semibold text-lg">{owner.username}</span> for <span className="font-semibold text-lg">{listing.name.toLowerCase()}</span></p>
                    <textarea className='w-full border p-3 rounded-lg' placeholder='Enter your message here...' name='message' id='message' rows="2" value={message} onChange={onChangeMessage}></textarea>
                    <Link className='bg-slate-700 text-white text-center uppercase rounded-lg hover:opacity-95 p-3' to={`mailto:${owner.email}?subject=Regarding ${listing.name}&body=${message}`}>
                        send Message
                    </Link>
                </div>
            )}
        </>
    )
}
