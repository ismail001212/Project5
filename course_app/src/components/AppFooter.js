import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <a href="" target="_blank" rel="noopener noreferrer">
          My Footer
        </a>
      </div>
      <div className="ms-auto">
        <a  target="_blank" rel="noopener noreferrer">
Footer        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
