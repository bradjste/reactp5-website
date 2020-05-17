import React, { Component } from 'react';

class Contact extends Component {

  componentWillMount() {
    this.props.isSplashNo()
    this.props.changeActivePage("contact")
  }

  componentDidMount() {
    if (!this.props.hasEntered) {
      document.getElementById('contactPage').classList.add('enter-off')
      setTimeout(this.fadeInDelay,200)
      setTimeout(this.props.enterChange,300);
    }   
    
  }

  fadeInDelay() {
    document.getElementById('contactPage').classList.remove('enter-off')
    document.getElementById('contactPage').classList.add('fade-in')
  }

  render() {
    return (
      <div id="contactPage">
        <div className="backingContact" />

        <div  className="contact">
          <h1 className="subtopic">Reach me here:</h1>
          <br/>
          <h2 className="subtopic">
            Email:
            <br className='brShow'/>
            <a href="mailto:bradjste@gmail.com?subject=Hi Brad!"  className='conLink' rel='noreferrer noopener'> bradjste@gmail.com</a>
          </h2>
          <h2 className="subtopic">
            Instagram:
            <br className='brShow'/>
            <a href="https://instagram.com/_u/bradjste" target = "_blank" className='conLink'  rel='noreferrer noopener'> @bradjste</a>
          </h2>
          <h2 className="subtopic">
            LinkedIn:  
            <br className='brShow'/>
            <a href="https://linkedin.com/in/bradjste" target="_blank" className='conLink' rel='noreferrer noopener'> linkedin.com/in/bradjste</a>
          </h2>
          <h2 className="subtopic">
            Github:  
            <br className='brShow'/>
            <a href="https://github.com/bradjste" target="_blank" className='conLink' rel='noreferrer noopener'> github.com/bradjste</a>
          </h2>
        </div>
      </div>
    )
  }
}

export default Contact