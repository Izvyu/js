import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { actions } from './reducers/app';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';
import { useSnackbar } from "notistack";
import AES from 'crypto-js/aes';
import { useForm } from "react-hook-form";
import PF from "./_Services/publicFunction";
import Qs from "qs";

const QueryReportlogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { register, formState: { errors }, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = (data) => {
    setLoading(true);
    PF.instance({
      method: "post",
      url: PF.url2 + "/login/GetChecklogin",
      data: Qs.stringify({
        Action: "1",
        parameter: {
          username: data.PersonalId,
          password: data.Password
        }
      }),
    }).then(function (response) {
      const { TotalRecord, Token } = response.data;
      if (TotalRecord <= 0) {
        enqueueSnackbar("帳號或密碼錯誤", { variant: "error" });
      } else {
        enqueueSnackbar("登入成功", { variant: "success" });
        dispatch(actions.UserInfo(data));
        dispatch(actions.TOKEN_SET(Token));

        localStorage.setItem("UserInfo", JSON.stringify({
          PersonalId: data.PersonalId,
          Password: AES.encrypt(data.Password, '加密密碼').toString()
        }));
        localStorage.setItem("token", Token);

        navigate('/Tgid');
      }
    }).finally(() => {
      setLoading(false);
    });
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        fontFamily: "'Noto Sans TC', sans-serif"
      }}
    >
      <Card
        sx={{
          width: 400,
          borderRadius: 4,
          backdropFilter: "blur(8px)",
          background: "rgba(255,255,255,0.9)",
          boxShadow: "0 8px 32px rgba(31,38,135,0.37)",
          border: "1px solid rgba(255,255,255,0.18)",
          animation: "fadeIn 1s ease-in-out",
          "@keyframes fadeIn": {
            from: { opacity: 0, transform: "translateY(10px)" },
            to: { opacity: 1, transform: "translateY(0)" },
          },
        }}
      >
        <CardContent sx={{ p: 5 }}>
          {/* Logo 或標題 */}
          <Typography
            variant="h4"
            align="center"
            sx={{
              fontWeight: 700,
              color: "#4A4A4A",
              letterSpacing: 1,
              mb: 1,
            }}
          >
            🔍 查詢報表
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            sx={{ color: "#777", mb: 3 }}
          >
            
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              margin="normal"
              id="PersonalId"
              label="使用者帳號"
              {...register("PersonalId", { required: { value: true, message: "必填欄位" } })}
              error={!!errors.PersonalId}
              helperText={errors?.PersonalId?.message}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  '&:hover fieldset': { borderColor: '#6C63FF' },
                  '&.Mui-focused fieldset': { borderColor: '#6C63FF' },
                },
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              type="password"
              id="Password"
              label="密碼"
              {...register("Password", { required: { value: true, message: "必填欄位" } })}
              error={!!errors.Password}
              helperText={errors?.Password?.message}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  '&:hover fieldset': { borderColor: '#6C63FF' },
                  '&.Mui-focused fieldset': { borderColor: '#6C63FF' },
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 3,
                py: 1.5,
                borderRadius: 3,
                fontWeight: "bold",
                fontSize: "1rem",
                textTransform: "none",
                background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "linear-gradient(90deg, #5a67d8 0%, #6b46c1 100%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 12px rgba(0,0,0,0.2)",
                },
              }}
            >
              {loading ? <CircularProgress size={26} color="inherit" /> : "登入"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default QueryReportlogin;
