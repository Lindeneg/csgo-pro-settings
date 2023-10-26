interface IntroductionProps {
    playerCount: number;
}

const Introduction = ({ playerCount }: IntroductionProps) => {
    return (
        <>
            <section className="w-full text-center p-12">
                <h6>This page contains a few simple graphs with data from {playerCount} professional CSGO players.</h6>
                <p className="mt-4 mb-4">
                    The data is scraped from{' '}
                    <a className="underline" href="https://liquipedia.net/" target="_blank">
                        Liquipedia
                    </a>{' '}
                    respecting their{' '}
                    <a className="underline" href="https://liquipedia.net/api-terms-of-use" target="_blank">
                        Terms of Use
                    </a>
                    .
                </p>
                <p>
                    The code and data is open-source and available{' '}
                    <a
                        className="underline"
                        href="https://github.com/Lindeneg/csgo-pro-settings-distribution"
                        target="_blank"
                    >
                        here
                    </a>
                    .
                </p>
            </section>
            <hr className="w-full" />
        </>
    );
};

export default Introduction;
