const Popup = ({ close, children }: { close: () => void; children: React.ReactNode }) => {
	return (
		<div className="relative">
			<div className="fixed left-0 top-0 z-50 size-full bg-zinc-900/50">
				<div className="absolute inset-0 m-auto flex size-full items-center justify-center">
					<button className="absolute inset-0 cursor-pointer" onClick={close}></button>
					<div className="absolute mx-5 flex w-11/12 flex-col place-items-center gap-6 bg-white p-6 lg:mx-0 lg:w-3/5 lg:gap-8 lg:p-10 xl:w-1/3">
						{children}
					</div>
				</div>
			</div>
		</div>
	)
}

export default Popup
