import React, { useEffect, useState } from 'react';
import { Head, Line } from '../../styles/Kakao/SearchAddress';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import mapdata from '../../csvjson.json';
import { MylocContainer } from '../../styles/MyLocation/Mylocation';
import WheelChairElevator from '../../assets/img/Barrierfree/disabled-elevator.png';
import Elevator from '../../assets/img/Barrierfree/elevator.png';
import Severalpeople from '../../assets/img/Barrierfree/family.png';
import FirstFloor from '../../assets/img/Barrierfree/first-floor.png';
import GuideDog from '../../assets/img/Barrierfree/guidedog.png';
import FreeParking from '../../assets/img/Barrierfree/parking.png';
import DisabledToilet from '../../assets/img/Barrierfree/toilet.png';
import WheelChair from '../../assets/img/Barrierfree/wheelchair.png';
import star from '../../assets/img/star.png';
import { useSelector } from 'react-redux';
import '../../styles/MyLocation/Mylocation.css'

type UserState = {
	user: {
		username: string;
		password: string;
		accessToken: string;
	};
};

const sfImages: { [key: string]: string } = {
	'WheelChair Elevator': WheelChairElevator,
	Elevator: Elevator,
	'Several people': Severalpeople,
	'First Floor': FirstFloor,
	'Guide Dog': GuideDog,
	'Free Parking': FreeParking,
	'Disabled Toilet': DisabledToilet,
	WheelChair: WheelChair,
};

const Mylocation = () => {
	const [mapdata, setMapdata] = useState([]) as any;
	const username = useSelector((state: UserState) => state.user.username);
	const navigate = useNavigate();
	const getData = async () => {
		try {
			const response = await axios.get(
				`/api/spots/mylocation/${username}`
				// {
				//   headers: {
				//     Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
				//   },
				// }
			);
			// console.log(response);
			setMapdata(response.data.spots);
		} catch (err) {
			// console.error(err);
		}
	};
	useEffect(() => {
		getData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<Head>
				<h1
					className="back"
					onClick={() => {
						navigate('/map');
					}}
				>
					&lt;
				</h1>
				<h1>내가 등록한 장소</h1>
			</Head>
			<Line />
			{mapdata.map((item: any, index: any) => (
			// {mapdata.filter((item: any) => item.username === username).map((item: any, index: any) => (
				<MylocContainer key={index}>
										<h1 className="spotname">{item.spotName}</h1>
					<div className="bfImgs">
						<img src={star} className="smallIcon" alt="" />
						<p>
							{item.reviewScore} / 5 | 리뷰수 : {item.reviewCount}
						</p>
					</div>
					<p className="spotaddress">{item.spotAddress}</p>
					<p>{item.spotTelNumber}</p>
					<div className="MylocbfImgs">
						{item?.spotSfInfos?.map((i: any) => (
							<div key={i.id}>
								<img className="MylocIcon" src={sfImages[i.sfInfo.sfName]} alt="" />
							</div>
						))}
					</div>
				</MylocContainer>
			))}
		</>
	);
};

export default Mylocation;
