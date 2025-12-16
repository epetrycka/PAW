// import { useState } from 'react'
import './List.css'
import Friend from './Friend';

function List() {

  return (
    <div className='list'>
      <div className='header'>
        List of friends
      </div>
      <div className='friends'>
        <Friend name="Jan Kowalski" phone="000 000 000" email="janek@op.pl"/>
        <Friend name="Jan Kowalski" phone="000 000 000" email="janek@op.pl"/>
        <Friend name="Jan Kowalski" phone="000 000 000" email="janek@op.pl"/>
        <Friend name="Jan Kowalski" phone="000 000 000" email="janek@op.pl"/>
        <Friend name="Jan Kowalski" phone="000 000 000" email="janek@op.pl"/>
        <Friend name="Jan Kowalski" phone="000 000 000" email="janek@op.pl"/>
      </div>
    </div>
  )
}

export default List
