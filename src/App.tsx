import { useState } from "react"
import { ShowRow } from "./component/ShowRow"
import { watchlist as initialWatchList, type Show } from "./data/watchlist"
import { cn } from "./utils/cn"

type Filter = "tutti" | "serie" | "film"
type Kinds = "film" | "serie"


function App() {
  const [nextWatch, setNextWatch] = useState<Show>()
  const [activeFilter, setActiveFilter] = useState<Filter>("tutti")
  const [title, setTitle] = useState<string>("");
  const [year, setYear] = useState<number>(0);
  const [kind, setKind] = useState<Kinds>("film");
  const [watchlist, setWatchlist] = useState(initialWatchList);

  function OnShowClick(show: Show) {
    if (nextWatch?.id === show.id) {
      setNextWatch(undefined);
    } else {
      setNextWatch(show)
    }
  }

  function OnSubmit() {
    console.log(title, year, kind);

    if (title === "") {
      alert("Titolo obbligatorio!!!")
      return
    }

    if (year < 1900 || year > new Date().getFullYear()) {
      alert(`Anno deve essere compreso tra il 1900 e il ${new Date().getFullYear()}!!!`)
      return
    }

    setTitle("");
    setYear(0);
    setKind("film");
    setWatchlist(prev => [...prev, {
      id: Math.max(...prev.map(show => show.id)) + 1,
      title,
      year,
      kind
    }])
  }

  return (
    <>
      <div className="flex flex-col justify-center items-center p-12">
        <h1 className="font-bold text-4xl text-center">La mia watchlist</h1>
        <div className="flex gap-4 mt-4">

          {["tutti", "serie", "film"].map(filtro =>
            <button
              key={filtro}
              className={cn("px-4 py-2 bg-gray-400 rounded-full", {
                "bg-blue-400": activeFilter === filtro
              })
              }
              onClick={() => setActiveFilter(filtro as Filter)}
            >{filtro}</button>)
          }

        </div>

        <div className="w-xl flex flex-col gap-4 py-4">
          {watchlist.filter(show => activeFilter === "tutti" || show.kind === activeFilter).map(show => <ShowRow onClick={() => OnShowClick(show)} show={show} key={show.id}></ShowRow>)}
        </div>

        <p>{watchlist.length} titoli: {watchlist.filter(show => show.kind === "film").length} film e {watchlist.filter(show => show.kind === "serie").length} serie</p>
        {nextWatch && <p className="font-bold">Stasera guardo: <span className="capitalize">{nextWatch.title}</span></p>}

        <div className="flex flex-col gap-4">
          <h1 className="font-bold text-center text-xl">Aggiungi Titolo</h1>
          <input
            placeholder="Titolo" value={title} onChange={(e) => setTitle(e.target.value)}
            className="bg-gray-200 p-2 rounded-lg"></input>
          <input
            placeholder="Anno" type="number" value={year} onChange={(e) => setYear(+e.target.value)}
            className="bg-gray-200 p-2 rounded-lg"></input>
          <div className="flex gap-4">
            {["film", "serie"].map(filtro =>
              <button
                key={filtro}
                className={cn("px-4 py-2 bg-gray-400 rounded-full", {
                  "bg-blue-400": kind === filtro
                })
                }
                onClick={() => setKind(filtro as Kinds)}
              >{filtro}</button>)
            }
          </div>
          <button className="rounded-full px-4 py-2 bg-blue-400" onClick={OnSubmit}>Aggiungi</button>
        </div>
      </div>



    </>

  )


}

export default App
