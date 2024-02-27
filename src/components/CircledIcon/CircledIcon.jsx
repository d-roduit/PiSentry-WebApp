export default function CircledIcon({ icon: IconClass, iconColor, bgColor, borderColor }) {
    return (
        <div className={`w-10 h-10 flex justify-center items-center border-2 rounded-full ${bgColor} ${borderColor}`}>
            <IconClass className={`text-2xl ${iconColor}`} />
        </div>
    )
}
