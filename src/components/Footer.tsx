import { Link } from 'react-router-dom'

function Footer() {
  return (
    <section className="overflow-hidden mt-auto lg:p-12 lg:px-24 border bg-red-600 border-red-300 dark:bg-red-600 border-t-2">
            <div className="">
                <div className="flex flex-wrap">
                    <div className="w-full p-6 md:w-1/2 lg:w-5/12">
                        <div className="flex h-full flex-col justify-between">
                            <div className="mb-4 inline-flex items-center text-white">
                                FOOTER
                            </div>
                            <div>
                                <p className="text-sm text-red-300">
                                    &copy; Copyright 2023. All Rights Reserved by Susekh.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-wrap justify-between lg:w-1/2 px-8'>
                    <div  className="lg:w-1/3 w-1/2 pb-4">
                        <div className="h-full lg:pt-0 pt-12">
                            <h3 className="tracking-px mb-9  text-xs font-semibold uppercase text-white">
                                Company
                            </h3>
                            <ul>
                                <li className="mb-4">
                                    <Link
                                        className=" text-base font-medium  hover:text-red-300 text-red-300 dark:hover:text-red-300"
                                        to="/"
                                    >
                                        Features
                                    </Link>
                                </li>
                                <li className="mb-4">
                                    <Link
                                        className=" text-base font-medium  hover:text-red-300 text-red-300 dark:hover:text-red-300"
                                        to="/"
                                    >
                                        Pricing
                                    </Link>
                                </li>
                                <li className="mb-4">
                                    <Link
                                        className=" text-base font-medium  hover:text-red-300 text-red-300 dark:hover:text-red-300"
                                        to="/"
                                    >
                                        Affiliate Program
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className=" text-base font-medium hover:text-red-300 text-red-300 dark:hover:text-red-300"
                                        to="/"
                                    >
                                        Press Kit
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="lg:w-1/3 w-1/2">
                        <div className="h-full lg:pt-0 pt-12">
                            <h3 className="mb-9 text-xs font-semibold uppercase text-white">
                                Support
                            </h3>
                            <ul>
                                <li className="mb-4">
                                    <Link
                                        className=" text-base font-medium  hover:text-red-200 text-red-300 dark:hover:text-red-300"
                                        to="/"
                                    >
                                        Account
                                    </Link>
                                </li>
                                <li className="mb-4">
                                    <Link
                                        className=" text-base font-medium hover:text-red-200 text-red-300 dark:hover:text-red-300"
                                        to="/"
                                    >
                                        Help
                                    </Link>
                                </li>
                                <li className="mb-4">
                                    <Link
                                        className=" text-base font-medium hover:text-red-200 text-red-300 dark:hover:text-red-300"
                                        to="/"
                                    >
                                        Contact Us
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className=" text-base font-medium hover:text-red-200 text-red-300 dark:hover:text-red-300"
                                        to="/"
                                    >
                                        Customer Support
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="lg:w-1/3 w-1/2">
                        <div className="h-full lg:pt-0 pt-12">
                            <h3 className="tracking-px mb-9  text-xs font-semibold uppercase text-white">
                                Legals
                            </h3>
                            <ul>
                                <li className="mb-4">
                                    <Link
                                        className=" text-base font-medium  hover:text-red-200 text-red-300 dark:hover:text-red-300"
                                        to="/"
                                    >
                                        Terms &amp; Conditions
                                    </Link>
                                </li>
                                <li className="mb-4">
                                    <Link
                                        className=" text-base font-medium hover:text-red-200 text-red-300 dark:hover:text-red-300"
                                        to="/"
                                    >
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className=" text-base font-medium hover:text-red-200 text-red-300 dark:hover:text-red-300"
                                        to="/"
                                    >
                                        Licensing
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    </div>

                </div>
            </div>
        </section>
  )
}

export default Footer