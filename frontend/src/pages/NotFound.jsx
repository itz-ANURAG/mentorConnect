// importing the required files
import React from 'react'
import {NavLink} from "react-router-dom" ;
import "../stylesheets/NotFound.css"

// page displayed if no valid route match the request
function NotFound() {
  return (
    <section className="page_404">
	<div className="container ">
		<div className="row">	
		<div className="col-sm-12 ">
		<div className="col-sm-10 col-sm-offset-1  text-center">
		<div className="four_zero_four_bg">
			<h1 className="text-center ">404</h1>
		</div>
		<div className="contant_box_404">
		<h3 className="h2">
		Look like you're lost
		</h3>
		<p>the page you are looking for not avaible!</p>
		<span><NavLink to="/" className="link_404" href="">Go to Home</NavLink></span>
	</div>
		</div>
		</div>
		</div>
	</div>
</section>
  )
}

// exporting the page
export default NotFound
