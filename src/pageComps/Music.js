import React, { Component } from 'react';
import {Link} from 'react-router-dom';
class Music extends Component {
render() {
return (
<div className="condiv">
<h1 className="subtopic">About Me</h1>
<h4>Hey there,</h4>
<h1>I'm Brad Stevenson</h1>
<h3>Full Stack Web <u>Developer</u> | UI/UX <u>Designer</u></h3>
<br></br>
<p>Halp
</p>
<Link to="/"><button type="button">
    <span>Back to splash</span>
  </button></Link>
</div>
)
}
}
export default Music