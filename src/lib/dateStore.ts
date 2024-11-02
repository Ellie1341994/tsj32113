import { readable } from 'svelte/store';
function getTimeUntilNextHalloween() {
  // Get the current date
  const now = new Date();

  // Set the target date to next Halloween
  let nextHalloween = new Date(now.getFullYear(), 9, 31); // October is 9 because months are 0-indexed
  // Check if Halloween has already passed this year
  if (now > nextHalloween) {
    // If it has, set it for next year
    nextHalloween = new Date(now.getFullYear() + 1, 9, 31);
  }

  // Calculate the difference in milliseconds
  // @ts-ignore
  let timeDifference = nextHalloween - now;

  // Convert milliseconds into larger units of time
  let days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  let hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let fraccionatedMinutes = (timeDifference % (1000 * 60 * 60)) / (1000 * 60);
  let minutes = Math.floor(fraccionatedMinutes);
  let seconds = Math.floor((fraccionatedMinutes - minutes) * 60);
  // Calculate months
  let months = 0;
  while (days >= 31) {
    days -= 31; // This is a simplification; months aren't always 31 days
    months++;
  }
  const daysCorrectionFromMonthSimplification = 7
  return `${months}M. ${days + daysCorrectionFromMonthSimplification}D. ${hours}h. ${minutes}m. ${seconds}s.`
  // return {
  //   months: months,
  //   days: days,
  //   hours: hours,
  //   minutes: minutes
  // };
}

// Example usage:
export default function(options={interval: 1000, format: 
    { month: 'long', day: 'numeric'}
    }) {
	const initialDate = getTimeUntilNextHalloween()
	
	// return a readable store
    // @ts-ignore
  return readable(initialDate, set => {
      // the `update` function sets the latest date
      // @ts-ignore
    const update = () => set(getTimeUntilNextHalloween())
    
    // setup an interval timer to update the store's value every x milliseconds
    const interval = setInterval(update, options.interval )
		
    // return a cleanup function,
    // it will stop the timer when the store is destroyed
    return () => clearInterval(interval)
  })
}