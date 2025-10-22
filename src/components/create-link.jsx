import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Card} from "./ui/card";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import Error from "./error";
import * as yup from "yup";
import useFetch from "@/hooks/use-fetch";
import {createUrl} from "@/db/apiUrls";
import {UrlState} from "@/context";
import {QRCode} from "react-qrcode-logo";

export function CreateLink() {
  const {user} = UrlState();

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

  useEffect(() => {
    if (error === null && data) {
      navigate(`/link/${data[0].id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, data]);

  const createNewLink = async () => {
    setErrors([]);
    
    if (!user?.id) {
      setErrors({form: "Please log in to create a link"});
      return;
    }
    
    try {
      await schema.validate(formValues, {abortEarly: false});
      const canvas = ref.current.canvasRef.current;
      const blob = await new Promise((resolve) => canvas.toBlob(resolve));
      await fnCreateUrl({...formValues, user_id: user.id}, blob);
    } catch (e) {
      const newErrors = {};

      e?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });

      setErrors(newErrors);
    }
  };

  return (
    <Dialog
      defaultOpen={longLink}
      onOpenChange={(res) => {
        if (!res) setSearchParams({});
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-orange-500 hover:bg-orange-600 text-gray-950 font-medium">
          Create New Link
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl text-white">Create New Link</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {formValues?.longUrl && (
            <div className="flex justify-center p-4 bg-white rounded-lg">
              <QRCode ref={ref} size={200} value={formValues?.longUrl} />
            </div>
          )}

          <div className="space-y-2">
            <Input
              id="title"
              placeholder="Short Link's Title"
              value={formValues.title}
              onChange={handleChange}
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-orange-500"
            />
            {errors.title && <Error message={errors.title} />}
          </div>

          <div className="space-y-2">
            <Input
              id="longUrl"
              placeholder="Enter your Loooong URL"
              value={formValues.longUrl}
              onChange={handleChange}
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-orange-500"
            />
            {errors.longUrl && <Error message={errors.longUrl} />}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Card className="p-2 bg-gray-800 border-gray-700 text-gray-400 text-sm">
                forReal.URL
              </Card>
              <Card className="p-2 bg-gray-800 border-gray-700 text-gray-400 text-sm">
                /
              </Card>
              <Input
                id="customUrl"
                placeholder="custom-alias (optional)"
                value={formValues.customUrl}
                onChange={handleChange}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-orange-500"
              />
            </div>
          </div>

          {error && <Error message={error.message} />}
        </div>

        <DialogFooter className="sm:justify-start">
          <Button
            type="button"
            onClick={createNewLink}
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-gray-950 font-medium disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-950 border-t-transparent rounded-full animate-spin"></div>
                Creating...
              </div>
            ) : (
              "Create Link"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}