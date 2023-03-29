import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PickCategory from '../Recommend/PickCategory';
import Recomendation from '../../assets/img/recomendation.png';
import Bookmark from '../../assets/img/Bookmark.png';
import Transportation from '../../assets/img/transportation.png';
import My from '../../assets/img/My.png';
import { FooterBlock, FooterPlace, Image, FooterP, Line } from '../../styles/Menu/FooterStyle';

function Footer() {
	const navigate = useNavigate();
	const [isOpen, setIsOpen] = useState(false);

	const modalHandler = () => {
		if (!isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'scroll';
		}
		setIsOpen((prev) => !prev);
	};

	const moveToMy = () => {
		navigate('/Mypage');
	};

	return (
		<>
			<FooterPlace>
				<Line />
				<FooterBlock>
					<div className="grid grid-cols-16 gap-1">
						<div className="col-start-1 col-end-4">
							<div onClick={modalHandler}>
								<Image src={Recomendation} />
								<FooterP>추천</FooterP>
							</div>
						</div>
						{isOpen ? <PickCategory modalHandler={modalHandler} /> : null}
						<div className="col-start-4 col-end-7">
							<Image src={Bookmark} />
							<FooterP>즐겨찾기</FooterP>
						</div>
						<div className="col-start-7 col-end-10">
							<Image src={Transportation} />
							<FooterP>교통정보</FooterP>
						</div>
						<div className="col-start-10 col-end-13" onClick={moveToMy}>
							<Image src={My} />
							<FooterP>MY</FooterP>
						</div>
					</div>
				</FooterBlock>
			</FooterPlace>
		</>
	);
}

export default Footer;
