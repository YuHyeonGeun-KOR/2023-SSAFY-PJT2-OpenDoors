import React, { ReactNode, useState, useRef, useEffect } from 'react';
import { Resizable, ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import '../../styles/Menu/Modal.css';
import TrafficInfo from '../Traffic/TrafficInfo';
import PickCategory from '../Recommend/PickCategory';
import { useSelector } from 'react-redux';
import TodayRecommend from '../Recommend/TodayRecommend';

interface ModalProps {
	id: string;
	title: string;
	show: boolean;
	handleClose: () => void;
	children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ id, title, show, handleClose, children }) => {
	const h = window.innerHeight * 0.78;
	const showHideClassName = show ? 'modal display-block' : 'modal display-none';
	const [height, setHeight] = useState(window.innerHeight * 0.45);
	const [width, setWidth] = useState(window.innerWidth);
	const [getChild, setGetChild] = useState<[]>([]);
	const isRecommend: any = useSelector((s: any) => s.userRecommend.isRecommend);

	const handleResize = (event: any, data: any) => {
		const { deltaY } = data;
		setHeight((prevHeight) => {
			const newHeight = prevHeight - deltaY;
			// Ensure newHeight is a valid number and within the constraints
			if (isNaN(newHeight) || newHeight < 200 || newHeight > h) {
				return prevHeight;
			}
			return newHeight;
		});
	};

	const contentRef = useRef<HTMLDivElement>(null);
	const handleClickOutside = (event: MouseEvent) => {
		if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
			handleClose();
		}
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const updateDimensions = () => {
		setHeight(window.innerHeight * 0.35);
		setWidth(window.innerWidth);
	};

	useEffect(() => {
		window.addEventListener('resize', updateDimensions);
		return () => {
			window.removeEventListener('resize', updateDimensions);
		};
	}, []);

	const receiveResponse = (e: any) => {
		setGetChild(e);
	};

	return (
		<div className={showHideClassName} id={id}>
			<ResizableBox
				className="modal"
				height={height}
				width={width}
				minConstraints={[width, window.innerHeight * 0.05]}
				maxConstraints={[width, h]}
				axis="y"
				handle={
					<div className="resize-handle-top">
						<div className="handle-line"></div>
					</div>
				}
				resizeHandles={['n']}
				onResize={handleResize}
			>
				<div className="modal-content">
					<span className="close" onClick={handleClose}>
						×
					</span>
					{children}
					{id === 'recommend' && isRecommend ? <TodayRecommend getChild={getChild} /> : null}
					{id === 'recommend' && !isRecommend ? <PickCategory receiveResponse={receiveResponse} /> : null}
					{id === 'trafficinfo' ? <TrafficInfo /> : null}
				</div>
			</ResizableBox>
		</div>
	);
};

export default Modal;
