import { readable } from 'svelte/store';
export default function(options={interval: 3600000, format: 
    { month: 'long', day: 'numeric'}
    }) {
	const initialDate = new Date()
	
	// return a readable store
    // @ts-ignore
  return readable(initialDate.toLocaleString("en-US",options.format), set => {
      // the `update` function sets the latest date
      // @ts-ignore
    const update = () => set(new Date().toLocaleString("en-US",options.format))
    
    // setup an interval timer to update the store's value every x milliseconds
    const interval = setInterval(update, options.interval )
		
    // return a cleanup function,
    // it will stop the timer when the store is destroyed
    return () => clearInterval(interval)
  })
}