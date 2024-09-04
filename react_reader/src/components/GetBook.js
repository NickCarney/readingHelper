//this component will display jsx that will get the title, author, and
//chapter of their desired book. This will later be used to get relevant
//definitions of vocab in their book, summaries of chapters, and quizzes.

import {useState, useEffect} from 'react';
import axios from 'axios';

function GetBook(){
    //three states to store title, author, and chapter
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [chapter, setChapter] = useState(null);
    const [result, setResult] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (submitted) {
            const timer = setTimeout(() => {
                sendInfo();
                setSubmitted(false);
            }, 1000); // Wait for 1 second

            return () => clearTimeout(timer);
        }
    }, [submitted, title, author, chapter]);


    function storeInfo(){
        //sets the state values to the form values entered by the user
        setTitle(document.getElementById("title").value);
        setAuthor(document.getElementById("author").value);
        setChapter(document.getElementById("chapter").value);
        
        setSubmitted(true);
        
    }

    async function sendInfo(){
        const bookData = {title, author, chapter};
        console.log(bookData);
        try {
            //send book data to flask backend
            const response = await axios.post('http://localhost:4020/api/book', bookData);
            setResult(response.data);
        } catch(error){
            console.error(error);
        }

    }

    return (
        <div>
            {/* A form where title, author, and chapter values are entered */}
            <form>
            <label>Enter the book title:</label>
            <input  type="text" id="title" placeholder="Silent Spring"/><br/><br/>
            <label>Enter the book author:</label>
            <input  type="text" id="author" placeholder="Rachel Carson"/><br/><br/>
            <label>Enter the book chapter:</label>
            <input  type="text" id="chapter" placeholder="2"/><br/><br/>
            <button type="button" onClick={storeInfo}>Submit</button>
            </form>
            <p id="titleSelection">Title: {title}</p>
            <p id="authorSelection">Author: {author}</p>
            <p id="chapterSelection">Chapter: {chapter}</p>

            {result && (
                <div>
                    <h2>Summary:</h2>
                    <p>{result.summary}</p>

                    <h2>Quiz:</h2>
                    <ul>
                        {result.quiz.map((question, index) => (
                            <li key={index}>{question}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default GetBook;