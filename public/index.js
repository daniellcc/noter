window.addEventListener('load', () => {  // format notes cards
  const URL = document.URL
  if(URL.includes('notes') || URL.includes('dashboard')) {
    const notes = {
      titles: Array.from(document.querySelectorAll('.note-title')),
      texts: Array.from(document.querySelectorAll('.note-text'))
    }

    const titlesVal = notes.titles.map(title => title.innerHTML)
    const textsVal = notes.texts.map(note => note.innerHTML)
    
    titlesVal.forEach((title, i) => {
      if(title.length > 30)
        notes.titles[i].innerHTML = title.slice(0, 30).trim() + '...'
    })

    textsVal.forEach((text, i) => {
      if(text.length > 50)
        notes.texts[i].innerHTML = text.slice(0, 50).trim() + '...'
    })
  }
  
})

