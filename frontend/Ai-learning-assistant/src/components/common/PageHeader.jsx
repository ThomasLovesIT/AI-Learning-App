import React from 'react'

const PageHeader = ({title, subtitle, children}) => {
        return(
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        {title}
                    </h1>
                    {subtitle  && (
                        <p className="mt-1 text-sm text-gray-600">
                            {subtitle}
                        </p>
                    )}
                </div>
                {children && <div className="flex items-center gap-3">{children}</div>}
            </div>
        )
}

export default PageHeader