import React, { ChangeEvent, useState } from 'react';
import { useNavigate, useLocation, NavLink, Routes, Route } from 'react-router-dom';
import '../../styles/Kakao/NewLocation.css';
import { Head, Line } from '../../styles/Kakao/SearchAddress';
import axios from 'axios';
import { RegisterMapAction } from '../../store/RegisterMapSlice';
import { useSelector, useDispatch } from 'react-redux';
import Checkbox from './Checkbox';
import { persistor } from '../../index';
import { Button } from '../../styles/Button/ButtonStyle';

interface Category {
	id: number;
	name: string;
}

const categories: Category[] = [
	{ id: 0, name: '카페' },
	{ id: 1, name: '음식점' },
	{ id: 2, name: '병원/약국' },
	{ id: 31, name: '도서관/서점' },
	{ id: 32, name: '영화관' },
	{ id: 33, name: '공원/체육관 및 야외시설' },
	{ id: 34, name: '문화시설' },
	{ id: 4, name: '숙박시설' },
	{ id: 5, name: '공공기관/법원/우체국' },
	{ id: 6, name: '장애인 복지센터' },
	{ id: 7, name: '상가시설' },
	{ id: 8, name: '버스터미널/지하철역' },
	{ id: 9, name: '기타' },
];

const NewLocation = () => {
	const navigate = useNavigate();
	const { state } = useLocation();
	const dispatch = useDispatch();
	const registerData: any = useSelector((s) => s);

	const bflist = [
		{ id: '1', sfName: '휠체어 접근 가능' },
		{ id: '2', sfName: '해당 장소가 1층에 위치함' },
		{ id: '3', sfName: '장애인 화장실 있음' },
		{ id: '4', sfName: '애완견/도우미견 출입가능' },
		{ id: '5', sfName: '장애인 엘리베이터 있음' },
		{ id: '6', sfName: '엘리베이터 있음' },
		{ id: '7', sfName: '건물 내 무료주차 가능' },
		{ id: '8', sfName: '가족/어린이 이용에 적합' },
	];

	// const [name, setName] = useState('');
	// const [address, setAddress] = useState('');
	// const [addressdetail, setAddressdetail] = useState('');
	// const [category, setCategory] = useState('');
	// const [telnum, setTelnum] = useState('');
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	// const [selectedFiles, setSelectedFiles] = useState([]);
	// const [checkedList, setCheckedList] = useState<string[]>([]);

	const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
		event.preventDefault();
		const filesArray = Array.from(event.target.files || []);
		setSelectedFiles((prevSelectedFiles) => [...prevSelectedFiles, ...filesArray]);
		dispatch(RegisterMapAction.addTospotImages(selectedFiles));
		// console.log(registerData.registerMap.spotImages);
	};

	const handleFileDelete = (fileIndex: number) => {
		setSelectedFiles((prevSelectedFiles) => prevSelectedFiles.filter((_, index) => index !== fileIndex));
		dispatch(RegisterMapAction.addTospotImages(selectedFiles));
		// console.log(registerData.registerMap.spotImages);
	};

	const goSearch = () => {
		navigate('/map/newlocation/search');
	};

	const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		dispatch(RegisterMapAction.addTospotName(event.target.value));
	};

	const handleDetailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		dispatch(RegisterMapAction.addTospotBuildingName(event.target.value));
	};

	const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
		const selectedIndex = event.target.options.selectedIndex;
		const selectedId = event.target.options[selectedIndex].id;
		dispatch(RegisterMapAction.addTospotCategory(parseInt(selectedId)));
	};

	const handleTelnumChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		dispatch(RegisterMapAction.addTospotTelNumber(event.target.value));
	};

	const goMainPage = () => {
		// console.log('reset');
		// persistor.purge();
		dispatch(RegisterMapAction.resetData());
		navigate('/map');
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		try {
			const formData = new FormData();
			const body = {
				spot: {
					spotName: registerData.registerMap.spotName,
					spotAddress: state?.address,
					spotBuildingName: registerData.registerMap.spotBuildingName,
					spotCategory: registerData.registerMap.spotCategory,
					spotTelNumber: registerData.registerMap.spotTelNumber,
					spotLat: state?.lat,
					spotLng: state?.lng,
					username: registerData.user.username,
				},
				sfInfos: registerData.registerMap.checkedList,
			};
			Array.from(selectedFiles).forEach((temp) => formData.append('spotImages', temp));
			const json = JSON.stringify(body);
			const blob = new Blob([json], { type: 'application/json' });
			formData.append('spotDto', blob);
			const response = await axios.post('/api/spot/save', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
				},
			});
			console.log(response);
			alert('등록되었습니다.')
			goMainPage();
		} catch (err) {
			console.error(err);
			alert('등록되지 않았습니다.')
		}
	};

	return (
		<div id="wrap">
			<Head>
				<h1
					className="back"
					onClick={goMainPage}
				>
					&lt;
				</h1>
				<h1>장소 등록하기</h1>
			</Head>
			<Line />
			<form className="w-60 max-w-sm mx-auto mt-5" onSubmit={handleSubmit}>
				<div className="md:flex md:items-center mb-6">
					<div className="md:w-1/3">
						<label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">장소명 (필수)</label>
					</div>
					<div className="md:w-2/3">
						<input
							className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white"
							// id="inline-full-name"
							type="text"
							placeholder="시설의 이름을 입력해주세요."
							onChange={handleNameChange}
							defaultValue={registerData.registerMap.spotName}
						/>
					</div>
				</div>
				<div className="md:flex md:items-center mb-6">
					<div className="md:w-1/3">
						<p className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">위치 (필수)</p>
					</div>
					<div className="md:w-2/3">
						<button
							className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white text-sm"
							onClick={goSearch}
						>
							<p className="addressName">{state ? state.address : '여기를 눌러 주소를 검색해주세요.'}</p>
						</button>
						<input
							className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white text-sm mt-3"
							// id="inline-full-name"
							type="text"
							placeholder="상세 정보를 입력하세요."
							onChange={handleDetailChange}
							defaultValue={registerData.registerMap.spotBuildingName}
						/>
					</div>
				</div>
				<div className="md:flex md:items-center mb-6">
					<div className="md:w-1/3">
						<label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">사진등록</label>
					</div>
					<div className="md:w-2/3 filebox">
						<Button type="button" className="FileBtnStyle">
							<label className="file-label" htmlFor="file">
								파일찾기
							</label>
							<input type="file" id="file" multiple onChange={handleFileSelect} />
						</Button>
						{selectedFiles.length > 0 && (
							<ul>
								{selectedFiles.map((file, index) => (
									<li key={index}>
										<img className="filesize" src={URL.createObjectURL(file)} alt={file.name} />
										{/* {file.name} */}
										<button onClick={() => handleFileDelete(index)}>Delete</button>
									</li>
								))}
							</ul>
						)}
					</div>
				</div>
				<div className="md:flex md:items-center mb-6">
					<div className="md:w-1/3">
						<label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">업종</label>
					</div>
					<div className="md:w-2/3">
						{/* <input
							className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white"
							// id="inline-full-name"
							type="text"
							placeholder="예) 음식점, 카페 등"
							onChange={handleCategoryChange}
							defaultValue={registerData.registerMap.spotCategory}
						/> */}
						<select
							className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white"
							defaultValue={registerData.registerMap.spotCategory}
							onChange={handleCategoryChange}
						>
							<option value="">업종을 선택해주세요.</option>
							{categories.map((category) => (
								<option key={category.id} value={category.name} id={category.id.toString()}>
									{category.name}
								</option>
							))}
						</select>
					</div>
				</div>
				<div className="md:flex md:items-center mb-6">
					<div className="md:w-1/3">
						<label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">전화번호</label>
					</div>
					<div className="md:w-2/3">
						<input
							className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white"
							// id="inline-full-name"
							type="text"
							placeholder="대표 전화번호를 입력해주세요."
							onChange={handleTelnumChange}
							defaultValue={registerData.registerMap.spotTelNumber}
						/>
					</div>
				</div>
				<div className="md:flex md:items-center mb-6">
					<div className="md:w-1/3">
						<p className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">시설 이용 가능 여부</p>
					</div>
					<div className="md:w-2/3">
						{/* {bflist.map((item) => {
							return (
								<label key={item.key}>
									<input
										type="checkbox"
										value={item.key}
										onChange={(e: ChangeEvent<HTMLInputElement>) => {
											// console.log(e.target.checked);
											checkListHandler(e.target.value, e.target.checked);
										}}
										checked={checkedList.includes(item.key) ? true : false}
									/>
									<p>{item.value}</p>
								</label>
							);
						})} */}
						{bflist.map((item, index) => {
							return <Checkbox key={index} id={item.id} label={item.sfName} />;
						})}
					</div>
				</div>
				<div className="md:flex md:items-center">
					<div className="md:w-1/3"></div>
					<div className="md:w-2/3 mb-8">
						<Button type="submit">등록완료</Button>
					</div>
				</div>
			</form>
		</div>
	);
};

export default NewLocation;
