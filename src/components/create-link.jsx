import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Error from "./error";
import * as yup from "yup";
import useFetch from "@/hooks/use-fetch";
import { createUrl } from "@/db/apiUrls";
import { UrlState } from "@/context";
import { QRCode } from "react-qrcode-logo";
import { Loader2, Link2, Sparkles } from "lucide-react";

export function CreateLink() {
  const { user } = UrlState();

  const navigate = useNavigate();
  const ref = useRef();

  let [searchParams, setSearchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState({
    title: "",
    longUrl: longLink ? longLink : "",
    customUrl: "",
  });
  const [generatedShortCode, setGeneratedShortCode] = useState("");

  const schema = yup.object().shape({
    title: yup.string().required("Title is required"),
    longUrl: yup
      .string()
      .url("Must be a valid URL")
      .required("Long URL is required"),
    customUrl: yup.string(),
  });

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.id]: e.target.value,
    });
  };

  const {
    loading,
    error,
    data,
    fn: fnCreateUrl,
  } = useFetch(createUrl, null);

  const [shortUrl, setShortUrl] = useState("");

  // Generate short URL preview when form values change
  useEffect(() => {
    const baseUrl = import.meta.env.VITE_CUSTOM_URL || window.location.origin;

    if (formValues.customUrl) {
      setShortUrl(`${baseUrl}/${formValues.customUrl}`);
    } else if (formValues.longUrl) {
      // Generate short code once and reuse it
      if (!generatedShortCode) {
        const tempShortCode = Math.random().toString(36).substr(2, 6);
        setGeneratedShortCode(tempShortCode);
        setShortUrl(`${baseUrl}/${tempShortCode}`);
      } else {
        setShortUrl(`${baseUrl}/${generatedShortCode}`);
      }
    } else {
      setShortUrl("");
      setGeneratedShortCode("");
    }
  }, [formValues.customUrl, formValues.longUrl, generatedShortCode]);

  useEffect(() => {
    if (error === null && data) {
      navigate(`/link/${data[0].id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, data]);

  const createNewLink = async () => {
    setErrors([]);

    if (!user?.id) {
      setErrors({ form: "Please log in to create a link" });
      return;
    }

    try {
      await schema.validate(formValues, { abortEarly: false });

      // Use the already generated short code from state
      const shortCode = generatedShortCode || Math.random().toString(36).substr(2, 6);

      const canvas = ref.current.canvasRef.current;
      const blob = await new Promise((resolve) => canvas.toBlob(resolve));

      await fnCreateUrl(
        {
          ...formValues,
          user_id: user.id,
          short_url: shortCode
        },
        blob
      );
    } catch (e) {
      const newErrors = {};

      e?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });

      setErrors(newErrors);
    }
  };

  // Get base URL for display
  const baseUrl = import.meta.env.VITE_CUSTOM_URL || window.location.origin;
  const displayDomain = new URL(baseUrl).hostname;

  return (
    <Dialog
      defaultOpen={longLink}
      onOpenChange={(res) => {
        if (!res) setSearchParams({});
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-neo-pink text-foreground border-3 border-foreground shadow-neo hover:shadow-neo-sm hover:translate-x-[2px] hover:translate-y-[2px]">
          <Sparkles className="w-5 h-5 mr-2" />
          Create New Link
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg bg-neo-cream border-3 border-foreground shadow-neo-xl p-0 overflow-hidden">
        {/* Header */}
        <div className="bg-neo-yellow border-b-3 border-foreground p-6">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-card border-3 border-foreground flex items-center justify-center">
                <Link2 className="w-6 h-6 text-foreground" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-foreground">
                  Create Short Link
                </DialogTitle>
                <p className="text-sm text-foreground font-medium">
                  Transform your long URL into a powerful short link
                </p>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-5">
          {/* QR Code Preview */}
          {formValues?.longUrl && (
            <div className="flex justify-center p-4 bg-card border-3 border-foreground shadow-neo">
              <QRCode
                ref={ref}
                size={200}
                value={shortUrl || formValues?.longUrl}
              />
            </div>
          )}

          {error && <Error message={error.message} />}

          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-foreground font-bold uppercase text-xs tracking-wide">
              Link Title
            </label>
            <Input
              id="title"
              placeholder="My Awesome Link"
              value={formValues.title}
              onChange={handleChange}
            />
            {errors.title && <Error message={errors.title} />}
          </div>

          {/* Long URL */}
          <div className="space-y-2">
            <label htmlFor="longUrl" className="text-foreground font-bold uppercase text-xs tracking-wide">
              Destination URL
            </label>
            <div className="relative">
              <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground" />
              <Input
                id="longUrl"
                placeholder="https://example.com/your-very-long-url"
                value={formValues.longUrl}
                onChange={handleChange}
                className="pl-12"
              />
            </div>
            {errors.longUrl && <Error message={errors.longUrl} />}
          </div>

          {/* Custom Alias */}
          <div className="space-y-2">
            <label htmlFor="customUrl" className="text-foreground font-bold uppercase text-xs tracking-wide flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-neo-pink" />
              Custom Alias
              <span className="text-muted-foreground normal-case font-medium">(optional)</span>
            </label>
            <div className="flex items-center">
              <span className="h-12 px-4 bg-muted border-3 border-foreground border-r-0 flex items-center text-sm text-foreground font-bold">
                {displayDomain}/
              </span>
              <Input
                id="customUrl"
                placeholder="my-custom-link"
                value={formValues.customUrl}
                onChange={handleChange}
                className="border-l-0"
              />
            </div>
            {errors.customUrl && <Error message={errors.customUrl} />}
          </div>

          {/* Submit Button */}
          <Button
            type="button"
            onClick={createNewLink}
            disabled={loading}
            className="w-full h-12 bg-neo-yellow text-foreground border-3 border-foreground shadow-neo hover:shadow-neo-sm hover:translate-x-[2px] hover:translate-y-[2px]"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Creating...
              </>
            ) : (
              <>
                Create Short Link
                <Sparkles className="ml-2 w-5 h-5" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}