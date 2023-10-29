import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useState } from 'react'
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export const CreateListing = () => {

    const navigate = useNavigate()

    const { currentUser } = useSelector(state => state.user)
    const [files, setFiles] = useState([])
    const [formData, setFormData] = useState({
        imageUrls: [],
        name: '',
        description: '',
        phone: '',
        type: 'trade',
        epics: 0,
        showtimes: 0,
        potws: 0,
        legends: 0,
        bigtimes: 0,
        isbigtime: false,
        islegend: false,
        isepic: false,
        isshowtime: false,
        regularPrice: 1,
        discountPrice: 0,
        offer: false,
    })

    console.log(formData)

    const [uploading, setUploading] = useState(false)

    const [imageUploadError, setImageUploadError] = useState(false)

    const [error, setError] = useState(false)

    const [loading, setLoading] = useState(false)


    const handleImageSubmit = (e) => {
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            setUploading(true)
            setImageUploadError(false)
            const promises = [];

            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]));
            }

            Promise.all(promises).then((urls) => {
                setFormData({ ...formData, imageUrls: formData.imageUrls.concat(urls) });
                setImageUploadError(false)
                setUploading(false)
            }).catch((err) => {
                setImageUploadError('Image upload failed (2mb max per image)');
                setUploading(false)
            })

        } else {
            setImageUploadError('You can only upload 6 images per listing')
            setUploading(false)
        }
    }

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app)
            const fileName = new Date().getTime() + file.name
            const storageRef = ref(storage, fileName)
            const uploadTask = uploadBytesResumable(storageRef, file)
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% done`)
                },
                (error) => {
                    reject(error)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                        resolve(downloadUrl)
                    })
                }
            )
        })
    }

    const handleRemoveImage = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i !== index)
        })
    }

    const handleChange = (e) => {
        if (e.target.id === 'sale' || e.target.id === 'trade') {
            if(e.target.id === 'trade'){
                setFormData({
                    ...formData,
                    type: e.target.id,
                    regularPrice: 1,
                    discountPrice: 0,
                    offer: false
                })
            }else{
                setFormData({
                    ...formData,
                    type: e.target.id
                })
            }
        }

        if (e.target.id === 'isbigtime' || e.target.id === 'islegend' || e.target.id === 'isshowtime' || e.target.id === 'isepic' || e.target.id === 'offer') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked
            })
        }

        if (e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea' || e.target.type === 'tel') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value
            })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.imageUrls.length < 1) return setError('You must upload at least one image')
            if (+formData.regularPrice < +formData.discountPrice || +formData.regularPrice === +formData.discountPrice) return setError('Discount price must be lower than regular price')
            setLoading(true)
            setError(false)

            const res = await fetch('/api/listing/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id
                })
            })

            const data = await res.json()
            setLoading(false);
            if (data.success === false) {
                setError(data.message);
            }
            navigate(`/listing/${data._id}`)
        } catch (err) {
            setError(err.message)
            setLoading(false)
        }
    }

    return (
        <main className='p-3 max-w-4xl mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>
            <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
                <div className='flex flex-col gap-4 flex-1'>
                    <input type='text' onChange={handleChange} value={formData.name} placeholder='Name' className='border p-3 rounded-lg' id='name' maxLength='70' minLength='10' required />
                    <textarea type='text' onChange={handleChange} value={formData.description} placeholder='Description' className='border p-3 rounded-lg' id='description' required />
                    <input type='tel' onChange={handleChange} value={formData.phone} placeholder='Phone number' className='border p-3 rounded-lg' id='phone' required />

                    <div className='flex gap-6 flex-wrap'>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='sale' className='w-5' onChange={handleChange} checked={formData.type === 'sale'} />
                            <span>Sell</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='trade' className='w-5' onChange={handleChange} checked={formData.type === 'trade'} />
                            <span>Trade</span>
                        </div>
                        
                        <div className='flex gap-2'>
                            <input type="checkbox" id='isbigtime' className='w-5' onChange={handleChange} checked={formData.isbigtime} />
                            <span>Big Time</span>
                        </div>

                        <div className='flex gap-2'>
                            <input type="checkbox" id='islegend' className='w-5' onChange={handleChange} checked={formData.islegend} />
                            <span>Legend</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='isepic' className='w-5' onChange={handleChange} checked={formData.isepic} />
                            <span>Epic</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='isshowtime' className='w-5' onChange={handleChange} checked={formData.isshowtime} />
                            <span>Show Time</span>
                        </div>
                        {formData.type === 'sale' && (<div className='flex gap-2'>
                            <input type="checkbox" id='offer' className='w-5' onChange={handleChange} checked={formData.offer} />
                            <span>Offer</span>
                        </div>)}

                    </div>
                    <div className='flex flex-wrap gap-6'>
                        
                        <div className='flex items-center gap-2'>
                            <input type="number" id="potws" min='1' max='100' required className='p-3 border border-gray-300 rounded-lg' onChange={handleChange} value={formData.potws} />
                            <p>POTW</p>
                        </div>

                        {formData.isbigtime && (<div className='flex items-center gap-2'>
                            <input type="number" id="bigtimes" min='1' max='100' required className='p-3 border border-gray-300 rounded-lg' onChange={handleChange} value={formData.bigtimes} />

                            <div className='flex flex-col items-center'>
                                <p className='font-semibold'>Big Time</p>
                            </div>

                        </div>)}
                        {formData.islegend && (<div className='flex items-center gap-2'>
                            <input type="number" id="legends" min='1' max='100' required className='p-3 border border-gray-300 rounded-lg' onChange={handleChange} value={formData.legends} />

                            <div className='flex flex-col items-center'>
                                <p className='font-semibold'>Legend</p>
                            </div>

                        </div>)}
                        {formData.isepic && (<div className='flex items-center gap-2'>
                            <input type="number" id="epics" min='1' max='100' required className='p-3 border border-gray-300 rounded-lg' onChange={handleChange} value={formData.epics} />

                            <div className='flex flex-col items-center'>
                                <p className='font-semibold'>Epics</p>
                            </div>

                        </div>)}
                        {formData.isshowtime && (<div className='flex items-center gap-2'>
                            <input type="number" id="showtimes" min='1' max='100' required className='p-3 border border-gray-300 rounded-lg' onChange={handleChange} value={formData.showtimes} />

                            <div className='flex flex-col items-center'>
                                <p className='font-semibold'>Show Time</p>
                            </div>

                        </div>)}

                        {formData.type === 'sale' && (<div className='flex items-center gap-2'>
                            <input type="number" id="regularPrice" min='1' max='1000000000' required className='p-3 border border-gray-300 rounded-lg' onChange={handleChange} value={formData.regularPrice} />

                            <div className='flex flex-col items-center'>
                                <p className='font-semibold'>Regular Price</p>
                            </div>

                        </div>)}
                        
                        {formData.type === 'sale' && formData.offer && (<div className='flex items-center gap-2'>
                            <input type="number" id="discountPrice" min='0' max='1000000000' required className='p-3 border border-gray-300 rounded-lg' onChange={handleChange} value={formData.discountPrice} />

                            <div className='flex flex-col items-center'>
                                <p className='font-semibold'>Discounted Price</p>
                            </div>

                        </div>)}
                    </div>
                </div>

                <div className="flex flex-col flex-1 gap-4">
                    <p className='font-semibold'>Images:<span className='font-normal text-gray-500 ml-2'>The first image will be cover(max 6)</span></p>

                    <div className=" flex gap-4">
                        <input onChange={(e) => setFiles(e.target.files)} className='p-3 border border-gray-300 rounded w-full' type='file' id="images" accept='image/*' multiple />
                        <button disabled={uploading} type='button' onClick={handleImageSubmit} className='p-3 text-green-700 border border-green-700 rounded-lg uppercase hover:shadow-lg disabled:opacity-80'>{uploading ? 'Uploading...' : 'Upload'}</button>
                    </div>

                    <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>
                    {
                        formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                            <div key={url} className="flex justify-between p-3 border items-center rounded-lg">
                                <img src={url} alt='listing image' className='w-40 h-40 object-cover rounded-lg' />
                                <button type='button' onClick={() => handleRemoveImage(index)} className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'>Delete</button>
                            </div>

                        ))
                    }
                    <button disabled={loading || uploading} className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80 '>{loading ? 'Creating...' : 'Create Listing'}</button>
                    {error && <p className='text-red-700 text-sm'>{error}</p>}
                </div>
            </form>

        </main>
    )
}
