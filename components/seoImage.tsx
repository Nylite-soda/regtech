import featuredImage from "@/public/images/default-reg.png";

type Prop = {
  customImage?: string;
};

const FeaturedImage = (props: Prop) => (
  <>
    {props.customImage ? (
      <meta property="og:image" content={props.customImage} />
    ) : (
      <meta name="og:image" content={"url-of-the-website" + featuredImage} />
    )}
  </>
);

export default FeaturedImage;
