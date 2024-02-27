export default function NavigationHeader({ leftContent, centerContent, rightContent }) {

    leftContent = typeof leftContent === 'function' ? leftContent() : leftContent;
    centerContent = typeof centerContent === 'function' ? centerContent() : centerContent;
    rightContent = typeof rightContent === 'function' ? rightContent() : rightContent;

    return (
        <header className="flex items-center px-3 h-12 font-bold text-gray-900 md:text-lg">
            <div className="basis-0 grow flex justify-start">{leftContent && leftContent}</div>
            <div className="basis-[content] grow ">{centerContent && centerContent}</div>
            <div className="basis-0 grow flex justify-end">{rightContent && rightContent}</div>
        </header>
    )
}
