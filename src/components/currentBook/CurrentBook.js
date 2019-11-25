import React, { Component }from 'react'

import { connect } from 'react-redux'

import FormAddBook from './../formAddBook/FormAddBook'
import { addUserBook } from '../../redux/actions/booksActions'


import {
    Link,
  } from "react-router-dom";

  import { Button } from 'antd'

  import './current-book.css'

class CurrentBook extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentBook: {},
            isLoading: true,
        }
    }

    componentDidMount() {
        this.getCurrentBook()
        .then(currentBook => { this.setState({currentBook}) })
        .then(() => { this.setState({isLoading: false}) })
        .catch(err => console.log('There was an error:' + err))
    }

    getCurrentBook = () => {
        return new Promise((resolve, reject) => {
            let book_id = this.props.match.params.book_id;

            let currentBook = this.props.currentBooks.find(currentBook => currentBook.id === book_id)

            if (!currentBook) {
                currentBook = this.props.userBooks.find(userBook => userBook.id === book_id)
            }
    
            currentBook !== undefined ? resolve(currentBook) : reject('error')
        })
      }

    addBook = (category) => {
        this.props.addUserBook(this.state.currentBook, category)
    }

    render() {

        const currentBook = this.state.currentBook;

        return (
            <div className="current-book">
                <Link className="current-book-link" to={`/rechercher`}><Button type="primary">Retour</Button></Link>
                {this.state.isLoading ? 
                    <h1>Loader</h1> : 
                    (
                    <div>
                        <div className="current-book-form-container">
                            {currentBook.volumeInfo.imageLinks !== undefined ? 
                            <img className="current-book-cover" src={currentBook.volumeInfo.imageLinks.thumbnail} alt=""/> :
                            <div className="current-book-cover"></div> }
                            <FormAddBook addBook={this.addBook}/>
                        </div>
                        <div className="current-book-informations">
                            <ul className="current-book-informations-authors-list">
                            {currentBook.volumeInfo.authors !== undefined ? currentBook.volumeInfo.authors.map(author => <li key={author}><h3>{author}</h3></li>) : null}
                            </ul>
                            <h4 className="current-book-informations-title">{currentBook.volumeInfo.title}</h4>
                            <span className="current-book-informations-published-date">{currentBook.volumeInfo.publishedDate}</span>
                            <p className="current-book-informations-description">{currentBook.volumeInfo.description !== undefined ? currentBook.volumeInfo.description : null}</p>
                        </div>
                    </div>
                    )}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        currentBooks: state.books.currentBooks,
        userBooks: state.books.userBooks
    }
}

const mapDispatchToProps = dispatch => ({
    addUserBook: (book, category) => dispatch(addUserBook(book, category))
})

export default connect(mapStateToProps, mapDispatchToProps)(CurrentBook);