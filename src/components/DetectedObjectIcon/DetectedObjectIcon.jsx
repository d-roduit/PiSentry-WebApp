import { FaCarSide, FaMotorcycle, FaBicycle, FaPersonWalking, FaDog, FaCat, FaQuestion } from 'react-icons/fa6';
import CircledIcon from '@/components/CircledIcon/CircledIcon.jsx';

export default function DetectedObjectIcon({ type }) {
    switch (type) {
        case 'car':
            return (
                <CircledIcon
                    icon={FaCarSide}
                    iconColor="text-indigo-400"
                    bgColor="bg-indigo-50"
                    borderColor="border-indigo-100"
                />
            );
        case 'motorcycle':
            return (
                <CircledIcon
                    icon={FaMotorcycle}
                    iconColor="text-indigo-400"
                    bgColor="bg-indigo-50"
                    borderColor="border-indigo-100"
                />
            );
        case 'bicycle':
            return (
                <CircledIcon
                    icon={FaBicycle}
                    iconColor="text-sky-400"
                    bgColor="bg-sky-50"
                    borderColor="border-sky-100"
                />
            );
        case 'person':
            return (
                <CircledIcon
                    icon={FaPersonWalking}
                    iconColor="text-sky-400"
                    bgColor="bg-sky-50"
                    borderColor="border-sky-100"
                />
            );
        case 'cat':
            return (
                <CircledIcon
                    icon={FaCat}
                    iconColor="text-yellow-400"
                    bgColor="bg-yellow-50"
                    borderColor="border-yellow-100"
                />
            );
        case 'dog':
            return (
                <CircledIcon
                    icon={FaDog}
                    iconColor="text-yellow-400"
                    bgColor="bg-yellow-50"
                    borderColor="border-yellow-100"
                />
            );
        default:
            return (
                <CircledIcon
                    icon={FaQuestion}
                    iconColor="text-gray-400"
                    bgColor="bg-gray-50"
                    borderColor="border-gray-100"
                />
            );
    }
}
