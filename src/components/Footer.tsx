import { Link } from 'react-router-dom'

function Footer() {
  return (
    <section className="overflow-hidden lg:p-12 lg:px-24 border bg-gray-100 dark:bg-neutral-800 border-t-2">
            <div className="">
                <div className="flex flex-wrap">
                    <div className="w-full p-6 md:w-1/2 lg:w-5/12">
                        <div className="flex h-full flex-col justify-between">
                            <div className="mb-4 inline-flex items-center dark:text-gray-400">
                                FOOTER
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    &copy; Copyright 2023. All Rights Reserved by Susekh.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-wrap justify-between lg:w-1/2 px-8'>
                    <div  className="lg:w-1/3 w-1/2 pb-4">
                        <div className="h-full lg:pt-0 pt-12">
                            <h3 className="tracking-px mb-9  text-xs font-semibold uppercase text-gray-500">
                                Company
                            </h3>
                            <ul>
                                <li className="mb-4">
                                    <Link
                                        className=" text-base font-medium text-gray-900 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300"
                                        to="/"
                                    >
                                        Features
                                    </Link>
                                </li>
                                <li className="mb-4">
                                    <Link
                                        className=" text-base font-medium text-gray-900 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300"
                                        to="/"
                                    >
                                        Pricing
                                    </Link>
                                </li>
                                <li className="mb-4">
                                    <Link
                                        className=" text-base font-medium text-gray-900 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300"
                                        to="/"
                                    >
                                        Affiliate Program
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className=" text-base font-medium text-gray-900 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300"
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
                            <h3 className="mb-9 text-xs font-semibold uppercase text-gray-500">
                                Support
                            </h3>
                            <ul>
                                <li className="mb-4">
                                    <Link
                                        className=" text-base font-medium text-gray-900 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300"
                                        to="/"
                                    >
                                        Account
                                    </Link>
                                </li>
                                <li className="mb-4">
                                    <Link
                                        className=" text-base font-medium text-gray-900 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300"
                                        to="/"
                                    >
                                        Help
                                    </Link>
                                </li>
                                <li className="mb-4">
                                    <Link
                                        className=" text-base font-medium text-gray-900 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300"
                                        to="/"
                                    >
                                        Contact Us
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className=" text-base font-medium text-gray-900 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300"
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
                            <h3 className="tracking-px mb-9  text-xs font-semibold uppercase text-gray-500">
                                Legals
                            </h3>
                            <ul>
                                <li className="mb-4">
                                    <Link
                                        className=" text-base font-medium text-gray-900 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300"
                                        to="/"
                                    >
                                        Terms &amp; Conditions
                                    </Link>
                                </li>
                                <li className="mb-4">
                                    <Link
                                        className=" text-base font-medium text-gray-900 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300"
                                        to="/"
                                    >
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className=" text-base font-medium text-gray-900 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300"
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