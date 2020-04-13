import React, { Component } from 'react';
import {Link} from 'react-router-dom';
class About extends Component {
render() {
return (
<div className="condiv">
<h1 className="subtopic">About Me</h1>
<p>
</p>
<Link to="/"><button type="button">
    <span>Back to splash</span>
  </button></Link>
</div>
)
}
}
export default About