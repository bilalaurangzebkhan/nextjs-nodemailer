// src/app/contact/page.tsx

"use client";
import {
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Text,
  Textarea,
  useToast,
  ChakraProvider,
} from "@chakra-ui/react";
import { useState } from "react";
import { sendContactForm } from "@/lib/api";

interface FormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const initValues: FormValues = { name: "", email: "", subject: "", message: "" };

interface State {
  isLoading: boolean;
  error: string;
  values: FormValues;
}

const initState: State = { isLoading: false, error: "", values: initValues };

export default function ContactPage() {
  const toast = useToast();
  const [state, setState] = useState<State>(initState);
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const { values, isLoading, error } = state;

  const onBlur = ({ target }: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setTouched((prev) => ({ ...prev, [target.name]: true }));

  const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setState((prev) => ({
      ...prev,
      values: {
        ...prev.values,
        [target.name]: target.value,
      },
    }));

  const onSubmit = async () => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
    }));
    try {
      await sendContactForm(values);
      setTouched({});
      setState(initState);
      toast({
        title: "Message sent.",
        status: "success",
        duration: 2000,
        position: "top",
      });
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message,
      }));
    }
  };

  return (
  <ChakraProvider>
    <section  className="pt-8 pb-20 md:pt-1 md:pb-10 bg-[radial-gradient(ellipse_50%_100%_at_top_right,#183EC2,#EAEEFA_150%)] overflow-x-clip">
    <Container className="pb-12">
      <div className="flex flex-col items-start gap-4 pb-6 md:flex-row md:justify-between md:gap-8">
        <div className="flex-1 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text mt-8 mb-6">Contact Us</h1>
        </div>
      </div>      
      
      {error && (
        <Text color="red.300" my={4} fontSize="xl">
          {error}
        </Text>
      )}

      <FormControl isRequired isInvalid={touched.name && !values.name} mb={5}>
        <FormLabel color="gray.800">Name</FormLabel> {/* Darker label */}
        <Input
          type="text"
          name="name"
          errorBorderColor="red.300"
          value={values.name}
          onChange={handleChange}
          onBlur={onBlur}
          color="gray.800"  
          bg="white" 
        />
        <FormErrorMessage>Required</FormErrorMessage>
      </FormControl>

      <FormControl isRequired isInvalid={touched.email && !values.email} mb={5}>
        <FormLabel color="gray.800">Email</FormLabel>
        <Input
          type="email"
          name="email"
          errorBorderColor="red.300"
          value={values.email}
          onChange={handleChange}
          onBlur={onBlur}
          color="gray.800"
          bg="white"
        />
        <FormErrorMessage>Required</FormErrorMessage>
      </FormControl>

      <FormControl mb={5} isRequired isInvalid={touched.subject && !values.subject}>
        <FormLabel color="gray.800">Subject</FormLabel>
        <Input
          type="text"
          name="subject"
          errorBorderColor="red.300"
          value={values.subject}
          onChange={handleChange}
          onBlur={onBlur}
          color="gray.800"
          bg="white"
        />
        <FormErrorMessage>Required</FormErrorMessage>
      </FormControl>

      <FormControl isRequired isInvalid={touched.message && !values.message} mb={5}>
        <FormLabel color="gray.800">Message</FormLabel>
        <Textarea
          name="message"
          rows={4}
          errorBorderColor="red.300"
          value={values.message}
          onChange={handleChange}
          onBlur={onBlur}
          color="gray.800"
          bg="white"
        />
        <FormErrorMessage>Required</FormErrorMessage>
      </FormControl>

      <Button
        variant="outline"
        colorScheme="blue"
        isLoading={isLoading}
        disabled={!values.name || !values.email || !values.subject || !values.message}
        onClick={onSubmit}
      >
        Submit
      </Button>
    </Container>
    </section>
  </ChakraProvider>

  );
}
